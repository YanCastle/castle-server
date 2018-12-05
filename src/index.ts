import * as Koa from 'koa'
import { config } from './use/config';
import { Context } from 'koa';
import { body, multi } from './use/parse';
import outcheck from './use/outcheck';
import { WatchType, watch } from './utils/index';
import { resolve } from 'path';
const koa = new Koa()
koa.use(outcheck)
//配置文件
koa.use(config)
//body
koa.use(body)
//文件上传
koa.use(multi)
class CastleServer {
    get Koa() { return koa; }
    /**
     * 启动服务
     * @param Port 
     */
    start(Port: number) {
        watch(['./dist/**/*.js'], [WatchType.Unlink, WatchType.Change, WatchType.Delete], (d) => {
            if (require.cache[resolve(d)]) {
                console.log(`File ${d} changed,deleted cache`)
                delete require.cache[resolve(d)]
            }
        })
        return koa.listen(Port);
    }
    /**
     * 注册中间件
     * @param m 
     */
    use(m: (ctx: Context, next: Function) => any) {
        koa.use(m);
    }
    /**
     * 安装插件，支持插件模式
     * @param plugin 
     */
    install(plugin: { install: Function }) {
        if ('function' == typeof plugin.install) {
            plugin.install(this, koa)
        }
    }
    watch(file: string | string[], type: WatchType[]) {
        // watch(file, type)
    }

}
const server = new CastleServer()
export default server;