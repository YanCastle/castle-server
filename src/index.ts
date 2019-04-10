import * as Koa from 'koa'
import { config } from './use/config';
import { Context } from 'koa';
import { body, multi } from './use/parse';
import outcheck from './use/outcheck';
import { WatchType, watch } from './utils/index';
import cors from './use/cors';
Date.prototype.toJSON = function () { return this.toLocaleString(); }
class CastleServer {
    _koa: Koa = new Koa()
    constructor() {
        this._koa.on('error', this.error)
    }
    _default: boolean = false;
    default() {
        this._default = true;
        this._koa.use(outcheck)
        //配置文件
        this._koa.use(config)
        //cors
        this._koa.use(cors)
        //body
        this._koa.use(body)
        //文件上传
        this._koa.use(multi)
    }
    get Koa() { return this._koa; }
    error(error: any) {
        console.error(error)
    }
    /**
     * 启动服务
     * @param Port 
     */
    start(Port: number) {
        return this._koa.listen(Port);
    }
    /**
     * 注册中间件
     * @param m 
     */
    use(m: (ctx: Context, next: Function) => any) {
        this._koa.use(m);
    }
    /**
     * 安装插件，支持插件模式
     * @param plugin 
     */
    install(plugin: { install: (that: CastleServer, koa: Koa, config: any) => any }, config: any = {}) {
        if (!this._default) {
            this.default()
        }
        if ('function' == typeof plugin.install) {
            plugin.install(this, this._koa, config)
        }
    }
    watch(file: string[], type: WatchType[], cb: Function | any) {
        watch(file, type, cb)
    }

}
const server = new CastleServer()
export default server;