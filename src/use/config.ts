import { Context } from "koa";
import { env } from 'process'
import { response } from "../utils";
import { resolve, join } from 'path';
import { exists } from "mz/fs";
import server from "..";
import hook, { HookWhen } from '@ctsy/hook';
import { ServerHook } from '../index';
var file = [
    resolve(`dist/config/index.js`),
    resolve(`dist/config/${env.NODE_ENV}.js`)
];
var exist_files: string[] = [];
(async () => {
    for (let i = 0; i < file.length; i++) {
        if (await exists(file[i])) {
            exist_files.push(file[i])
        }
    }
})()
export async function config(ctx: Context, next: Function) {
    let ConfigFile = env.CONFIG_FILE;
    if (!ConfigFile) {
        ConfigFile = exist_files.length > 0 ? exist_files[0] : '@ctsy/config'
    }
    if (['.', '/'].indexOf(ConfigFile.substr(0, 1)) > -1) {
        ConfigFile = resolve(ConfigFile);
    }
    await hook.emit(ServerHook.Config, HookWhen.Before, ctx, {})
    let config = require(ConfigFile)
    ctx.config = new config.default(ctx);
    ctx.config.ModulesMap = server._modules;
    // await ctx.config.getController()
    await hook.emit(ServerHook.Config, HookWhen.After, ctx, {})
    await next()
}