import * as Koa from 'koa'
import { config } from './use/config';
import { Context } from 'koa';
import { body, multi } from './use/parse';
import outcheck from './use/outcheck';
import { WatchType, watch } from './utils/index';
import cors from './use/cors';
import * as path from 'path'
const dlog = require('debug')('server')
const pk = require(path.join(__dirname, '../package.json'))
const upk = require(process.cwd() + '/package.json');
// import * as compress from 'koa-compress'
import hook, { HookWhen } from '@ctsy/hook';
Date.prototype.toJSON = function () { return this.toLocaleString(); }
export enum ServerHook {
    Start = "Start",
    Install = "Install",
    GetCtx = "GetCtx",
}
class CastleServer {
    _koa: Koa = new Koa()
    constructor() {
        dlog('CastleServer Starting with version : ' + pk.version);
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
        //压缩
        // this._koa.use(compress())
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
        // dlog(upk.name + ' startted at ' + upk.version)
        console.log(upk.name + ":" + upk.version + ' startted at 0.0.0.0:' + Port)
        hook.emit(ServerHook.Start, HookWhen.Before, this, { Port });
        let r = this._koa.listen(Port);
        hook.emit(ServerHook.Start, HookWhen.After, this, { Port });
        return;
    }
    /**
     * 注册中间件
     * @param m 
     */
    use(m: (ctx: Context, next: Function) => any) {
        this._koa.use(m);
    }
    _modules: { [index: string]: string } = {};
    _prefix: { [index: string]: string } = {};
    /**
     * 注册模块
     */
    module(prefix: string, path: string, hooks: { [index: string]: (ctx: any) => Promise<any> } = {}) {
        this._modules[prefix] = path;
    }
    /**
     * 安装插件，支持插件模式
     * @param plugin 
     */
    install(plugin: { install: (that: CastleServer, koa: Koa, config: any) => any, name?: string }, config: any = {}) {
        if (!this._default) {
            this.default()
        }
        dlog('install plugin:' + plugin.name)
        if ('function' == typeof plugin.install) {
            hook.emit(ServerHook.Install, HookWhen.Before, this, plugin);
            plugin.install(this, this._koa, config)
            hook.emit(ServerHook.Install, HookWhen.After, this, plugin);
        }
    }
    watch(file: string[], type: WatchType[], cb: Function | any) {
        watch(file, type, cb)
    }

}
const server = new CastleServer()
export default server;