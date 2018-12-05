import server from './index'
import { response } from './utils';
server.use(async (ctx, next) => {
    // await po()
    // response(ctx, 'a')
    // next()
    // await ctx.session.set('a', Number((await ctx.session.get('a')) || 0) + 1);
    // response(ctx, await ctx.session.get('a'));

    // await ctx.session.destory()
    next()
})
server.start(9898);