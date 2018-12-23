import { Context } from 'koa';
export default async function cors(ctx: Context, next: Function) {
    if (['OPTIONS', "POST"].indexOf(ctx.method) > -1 && await ctx.config.allowCORS()) {
        corsset(ctx)
    }
    await next();
}
function corsset(ctx: Context) {
    ctx.set('Access-Control-Allow-Origin', ctx.header.origin);
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type, token");
    ctx.set("Access-Control-Allow-Credentials", 'true');
    ctx.set("Access-Control-Max-Age", '86400');
}