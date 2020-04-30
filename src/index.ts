import * as Koa from 'koa'
import { config } from './use/config';
import { Context } from 'koa';
import { body, multi } from './use/parse';
import outcheck from './use/outcheck';
import { WatchType, watch } from './utils/index';
import cors from './use/cors';
import hook, { HookWhen } from '@ctsy/hook';
import { exists } from 'mz/fs';
import { join, resolve } from 'path';
const dlog = require('debug')('server')
const pk = require(join(__dirname, '../package.json'))
const upk = require(process.cwd() + '/package.json');
Date.prototype.toJSON = function () { return this.toLocaleString(); }
export enum ServerHook {
    Start = "Start",
    Install = "Install",
    GetCtx = "GetCtx",
    Outcheck = 'server/outcheck',
    Config = 'server/config'
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
    /**
     * 模块配置
     */
    _modulesConfig: { [index: string]: { path: string, conf: { [index: string]: any } } } = {};
    _prefix: { [index: string]: string } = {};
    /**
     * 注册模块，默认会加载模块目录下的lib/hooks.js文件作为模块的启动文件
     * @param prefix 模块前缀
     * @param path 模块路径
     * @param conf 模块配置 
     */
    async module(prefix: string, path: string, conf: { [index: string]: any }) {
        this._modules[prefix] = path;
        this._modulesConfig[prefix] = {
            path,
            conf
        }
        let file = join(path, 'lib/hooks.js')
        if (await exists(file)) {
            require(resolve(file));
        }
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