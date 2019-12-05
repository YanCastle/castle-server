import { Context } from 'koa';
import * as chokidar from 'chokidar'
import { config } from '../use/config';
import hook, { HookWhen } from '@ctsy/hook';
import { ServerHook } from '../index';
/**
 * 设置响应
 * @param ctx 
 * @param content 
 * @param httpCode 
 */
export function response(ctx: Context, content: string | any, httpCode: number = 200) {
    ctx.config.sendFile = true;
    ctx.body = content;
    ctx.state = httpCode;
}
/**
 * 重定向
 * @param ctx 
 * @param url 
 */
export function redirect(ctx: Context, url: string) {
    ctx.status = 301;
    ctx.redirect(url);
}

export enum WatchType {
    Add = 'add',
    Change = 'change',
    Delete = 'unlink',
    Unlink = 'unlink',
    AddDir = 'addDir',
    Raw = 'raw'
}
/**
 * 监听文件变化
 * @param Path 
 * @param Type 
 * @param Callback 
 */
export function watch(Path: string[], Type: WatchType[], Callback: (...args: any[]) => void) {
    if (Callback instanceof Function) {
        let wathcer = chokidar.watch(Path)
        Type.forEach((d: string) => {
            wathcer.on(d, Callback)
        })
        return wathcer;
    }
}

/**
 * 获取一个空的请求对象
 */
export function get_ctx() {
    let req = { body: {} }, rep = { body: {} };
    let ctx: any = {
        body: {},
        req, request: req,
        rep, response: rep,
        state: 200,
        redirect() { },
        query: "",
        host: "",
    }
    return new Promise(async (s, j) => {
        await hook.emit(ServerHook.GetCtx, HookWhen.Before, ctx, {})
        config(ctx, () => {
            s(ctx)
        })
    })
}