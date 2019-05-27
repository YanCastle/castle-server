import { Context } from 'koa';
import * as chokidar from 'chokidar'
/**
 * 设置错误响应
 * @param ctx 
 * @param content 
 * @param httpCode 
 */
export function response(ctx: Context, content: string | any, httpCode = 200) {
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