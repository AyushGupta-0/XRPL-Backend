import { Response } from "express"
import ApiRequest from "../interfaces/ApiRequest"
import { fetchBalance } from "../helpers/xrpl"
import xumm from "../helpers/xumm"
import db from "../helpers/firebase"
import generateToken from "../helpers/jwt"
import User from '../interfaces/User'
import {XummPostPayloadBodyJson} from 'xumm-sdk/dist/src/types/xumm-api/index'
import {PayloadAndSubscription} from 'xumm-sdk/dist/src/types/Payload/PayloadAndSubscription'
import {v4} from 'uuid'

export const createAccountWithXumm = async (req: ApiRequest, res: Response) => {
	const transaction: XummPostPayloadBodyJson = {
		txjson: {
			TransactionType: "SignIn",
		},
	}
	const subscription: PayloadAndSubscription | undefined = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
		if(event.data.signed){
			const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)				
			const userRef = db.collection('users').doc(payload?.response.account as string)
			let userDoc = await userRef.get()
			if(userDoc.exists && userDoc.data()?.provider === 'xumm'){
				req.io?.emit('accountCreated', {status: 'failed', provider: 'xumm', message: 'Account already exists'})
			}else if(userDoc.exists){
				req.io?.emit('accountCreated', {status: 'failed', provider: userDoc.data()?.provider, message: 'Account already exists but not created with Xumm'})
			}else{
				let user: User = {
					name: `user_${v4()}`,
					defaultWallet: payload?.response.account as string,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					provider: 'xumm',
					xummToken: payload?.application.issued_user_token as string
				}
				const doc = await userRef.set(user)
				userDoc = await userRef.get()
				const balance = await fetchBalance(payload?.response.account as string)
				const token = generateToken(userDoc.id)
				req.io?.emit('accountCreated', {status: 'success', token: token, address: userDoc.id, balance, data:userDoc.data()})
			}
		}
	})
	res.json({uuid: subscription?.created.uuid, url: `https://xumm.app/sign/${subscription?.created.uuid}`, wss: `wss://xumm.app/sign/${subscription?.created.uuid}`})
}

export const loginAccountWithXumm = async (req: ApiRequest, res: Response) => {
	const transaction: XummPostPayloadBodyJson = {
		txjson: {
			TransactionType: "SignIn",
		},
	}
	const subscription = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
		if(event.data.signed){
			const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)
			const userRef = db.collection('users').doc(payload?.response.account as string)
			let user = await userRef.get()
			if(user.exists && user.data()?.provider === 'xumm'){
				const balance = await fetchBalance(payload?.response.account as string)
				const token = generateToken(user.id)
				req.io?.emit('accountLoggedIn', {status: 'success', token: token, address: user.id, balance, data:user.data()})
			}else if(user.exists){
				req.io?.emit('accountLoggedIn', {status: 'failed', exists: true, provider: user.data()?.provider, message: 'Account already exists but not created with Xumm'})
			}else{
				req.io?.emit('accountLoggedIn', {status: 'failed', exists: false, message: 'Account does not exist'})
			}
		}
	})
	res.json({uuid: subscription?.created.uuid, url: `https://xumm.app/sign/${subscription?.created.uuid}`, wss: `wss://xumm.app/sign/${subscription?.created.uuid}`})
}

export const getProfile = async (req: ApiRequest, res: Response) => {
	res.status(200).json(req.user)
}

export const createAccountWithOAuth = async (req: ApiRequest, res: Response) => {

}

export const loginAccountWithOAuth = async (req: ApiRequest, res: Response) => {
		
}