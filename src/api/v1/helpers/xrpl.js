const xrpl = require('xrpl')
let net = "wss://testnet.xrpl-labs.com"
const client = new xrpl.Client(net)

const fetchBalance = async (address) => {
    await client.connect()
    const balance = await client.getXrpBalance(address)
    return balance
}

module.exports = {client, fetchBalance}