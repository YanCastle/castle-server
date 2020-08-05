import { Context } from 'koa';
import Hook, { HookWhen } from '@ctsy/hook';
import { ServerHook } from '../index';
export default async function outcheck(ctx: Context, next: Function) {
    try {
        await Hook.emit(ServerHook.Outcheck, HookWhen.Before, ctx, {})
        await next()
        await Hook.emit(ServerHook.Outcheck, HookWhen.After, ctx, {})
    } catch (error) {
        ctx.error = error;
        await Hook.emit(ServerHook.Outcheck, HookWhen.Error, ctx, error)
    } finally {
        if (ctx.config && !ctx.config.sendFile) {
            if (ctx.body instanceof ReadableStream) {

            } else {
                ctx.body = ctx.config && ctx.config.outcheck ? await ctx.config.outcheck(ctx) : { c: ctx.status, d: ctx.body, i: '', e: 'Not Found' };
            }
        }
    }
}