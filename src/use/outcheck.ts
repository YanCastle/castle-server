import { Context } from 'koa';
import Hook, { HookWhen } from '@ctsy/hook';
export default async function outcheck(ctx: Context, next: Function) {
    try {
        await Hook.emit('outcheck', HookWhen.Before, ctx, {})
        await next()
        await Hook.emit('outcheck', HookWhen.After, ctx, {})
    } catch (error) {
        ctx.error = error;
        await Hook.emit('outcheck', HookWhen.Error, ctx, error)
    } finally {
        if (ctx.config && !ctx.config.sendFile) {
            ctx.body = ctx.config && ctx.config.outcheck ? await ctx.config.outcheck(ctx) : { c: ctx.status, d: ctx.body, i: '', e: 'Not Found' };
        }
    }
}