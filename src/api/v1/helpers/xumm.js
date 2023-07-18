const { Xumm } = require('xumm')

const xumm = new Xumm(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)

xumm.ping().then(res => console.log(res)).catch(err => console.log(err))

module.exports = xumm