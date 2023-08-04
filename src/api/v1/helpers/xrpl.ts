import { Wallet, Client, convertHexToString, AccountSetAsfFlags, Transaction } from "xrpl"
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
        command: "account_nfts",
        account: address,
        ledger_index: "validated"
    })).result.account_nfts
    nfts.forEach(async (nft: AccountNFToken) => {
        nft.URI = convertHexToString(nft.URI as string)
    })
    return nfts;
}

// Utility function to fetch Transaction details from XRPL
export const fetchTransaction = async (txid: string) => {
    await xrpl.connect();
    const transaction = await xrpl.request({
        command: "tx",
        transaction: txid,
        binary: false
    })
    return transaction
}

// Utility function to set minter of an account on XRPL
export const setMinter = async (user: string) => {
    await xrpl.connect()
    const platformWallet = Wallet.fromSeed(process.env.PLATFORM_XRP_SECRET as string)
    const tx_json: Transaction = {
        TransactionType: "AccountSet",
        Account: process.env.PLATFORM_XRP_ACCOUNT as string,
        NFTokenMinter: user,
        SetFlag: AccountSetAsfFlags.asfAuthorizedNFTokenMinter
    }
    const prepared = await xrpl.autofill(tx_json)
    const signed = platformWallet.sign(prepared)
    const transaction = await xrpl.submitAndWait(signed.tx_blob)
}