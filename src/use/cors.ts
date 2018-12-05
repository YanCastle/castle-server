import { Context } from 'koa';
export default async function cors(ctx: Context, next: Function) {
    //TODO 动态加载配置文件完成
    if (ctx.method == 'OPTIONS') {
        corsset(ctx)
        ctx.body = "";
    } else if (ctx.method == "POST") {
        if (await ctx.config.allowCORS()) {
            await next();
            corsset(ctx)
        }
    } else {
        next();
    }
}
function corsset(ctx: Context) {
    ctx.set('Access-Control-Allow-Origin', ctx.header.origin);
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    ctx.set("Access-Control-Allow-Credentials", 'true');
    ctx.set("Access-Control-Max-Age", '86400');
}