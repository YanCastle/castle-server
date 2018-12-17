import { Context } from "koa";
import { env } from 'process'
import { response } from "../utils";
import { resolve, join } from 'path';
import { exists } from "mz/fs";
export async function config(ctx: Context, next: Function) {
    let ConfigFile = env.CONFIG_FILE;
    if (!ConfigFile) {
        let file = [
            resolve(`dist/config/${env.NODE_ENV}.js`),
            resolve(`dist/config/index.js`),
        ];
        for (let i = 0; i < file.length; i++) {
            if (await exists(file[i])) {
                ConfigFile = file[i]
            }
        }
    }
    if (!ConfigFile) {
        ConfigFile = 'castle-config'
    }
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