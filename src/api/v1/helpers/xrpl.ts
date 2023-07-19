import * as xrpl from "xrpl"

const net: string = "wss://testnet.xrpl-labs.com"

export const client: xrpl.Client = new xrpl.Client(net)

export const fetchBalance = async (address: string) => {
    await client.connect()
    const balance: string = await client.getXrpBalance(address)
    return balance
}
