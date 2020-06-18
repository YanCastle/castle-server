const bodyparser: any = require('koa-bodyparser')
const multiparty: any = require('koa2-multiparty')
export const multi = multiparty()
export const body = bodyparser({
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '30mb',
    formLimit: '30mb',
})