import { Client, convertHexToString } from "xrpl"
import { AccountNFToken } from 'xrpl/dist/npm/models/methods/accountNFTs'

const net: string = "wss://testnet.xrpl-labs.com"

const xrpl: Client = new Client(net)

// Utility function to fetch balance of an account from XRPL
export const fetchBalance = async (address: string) => {
    await xrpl.connect()
    const balance: string = await xrpl.getXrpBalance(address)
    return balance
}
// Utility function to fetch NFTs of an account from XRPL
export const fetchNFTs = async (address: string) => {
    await xrpl.connect()
    const nfts = (await xrpl.request({
        "command": "account_nfts",
        "account": address,
        "ledger_index": "validated"
    })).result.account_nfts
    nfts.forEach(async (nft: AccountNFToken) => {
        nft.URI = convertHexToString(nft.URI as string)
    })
    return nfts;
}
