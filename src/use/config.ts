import { Context } from "koa";
import { env } from 'process'
import { response } from "../utils";
import { resolve } from "path";
export async function config(ctx: Context, next: Function) {
    let ConfigFile = env.CONFIG_FILE || 'castle-config'
    if (['.', '/'].indexOf(ConfigFile.substr(0, 1)) > -1) {
        ConfigFile = resolve(ConfigFile);
    }
    try {
        let config = require(ConfigFile)
        ctx.config = new config.default(ctx);
        await next()
    } catch (error) {
        response(ctx, error, 500);
    }
}