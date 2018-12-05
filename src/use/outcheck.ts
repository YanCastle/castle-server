import { Context } from 'koa';
export default async function outcheck(ctx: Context, next: Function) {
    try {
        await next()
    } catch (error) {
        ctx.error = error;
    } finally {
        ctx.body = await ctx.config.outcheck(ctx);
    }
}