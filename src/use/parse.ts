// import * as multiparty from 'koa2-multiparty'
import * as bodyparser from 'koa-bodyparser'
const multiparty: any = require('koa2-multiparty')
export const multi = multiparty()
export const body = bodyparser({
    enableTypes: ['json', 'form', 'text']
})