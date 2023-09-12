import { Response } from "express"
import ApiRequest from "../interfaces/ApiRequest"
import { fetchBalance } from "../helpers/xrpl"
import db from "../helpers/firebase"


// Returns state of the user (logged in or not)
export const getProfile = async (req: ApiRequest, res: Response) => {
	const balance = await fetchBalance(req.user.defaultWallet)
	res.json({status: 'success', data: {...req.user, balance}})
}

export const getPublicProfile = async (req: ApiRequest, res: Response) => {
	const query = await db.collection('users').where('username', '==', req.params.username).limit(1).get()
	let userDoc = query.docs[0]
	if(!userDoc){
		return res.status(404).json({status: 'failed', message: 'User not found'})
	}
	res.json({
		status: 'success',
		data: {
			username: userDoc.data().username,
			defaultWallet: userDoc.data().defaultWallet,
			profilePicture: userDoc.data().profilePicture,
			name: userDoc.data().name,
			bio: userDoc.data().bio,
		}
	})
}