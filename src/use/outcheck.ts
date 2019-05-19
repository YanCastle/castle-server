import { Context } from 'koa';
export default async function outcheck(ctx: Context, next: Function) {
    try {
        await next()
    } catch (error) {
        ctx.error = error;
    } finally {
        if (ctx.config && !ctx.config.sendFile) {
            ctx.body = ctx.config && ctx.config.outcheck ? await ctx.config.outcheck(ctx) : { c: ctx.status, d: ctx.body, i: '', e: 'Not Found' };
        }
    }
}