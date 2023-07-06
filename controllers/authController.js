const {xumm} = require('../utils/xumm')
const db = require('../utils/firebase')
const {generateToken} = require('../utils/jwt')

module.exports = {
    createAccountWithXumm: async (req, res) => {
		const transaction = {
			txjson: {
				TransactionType: "SignIn",
			},
		}
		const subscription = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
			if(event.data.signed){
				const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)				
				const userRef = await db.collection('users').doc(payload.response.account)
				var user = await userRef.get()
				if(user.exists && user.data().signupMode === 'xumm'){
					req.io.emit('accountCreated', {status: 'failed', signupMode: 'xumm', message: 'Account already exists'})
				}else if(user.exists){
					req.io.emit('accountCreated', {status: 'failed', signupMode: user.data().signupMode, message: 'Account already exists but not created with Xumm'})
				}else{
					const doc = await userRef.set({
						user_token: payload.application.issued_user_token,
						created: new Date(),
						updated: new Date(),
						signupMode: 'xumm'
					})
					user = await userRef.get()
					const token = await generateToken({address: user.id, expiry: Date.now() + 1000 * 60 * 60 * 24})
                    req.io.emit('accountCreated', {status: 'success', token: token, address: user.id, data:user.data()})
				}
			}
		})
		res.json({uuid: subscription.created.uuid, url: `https://xumm.app/sign/${subscription.created.uuid}`, wss: `wss://xumm.app/sign/${subscription.created.uuid}`})
	},
	loginAccountWithXumm: async (req, res) => {
		const transaction = {
			txjson: {
				TransactionType: "SignIn",
			},
		}
		const subscription = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
			if(event.data.signed){
				const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)
				const userRef = await db.collection('users').doc(payload.response.account)
				var user = await userRef.get()
				if(user.exists && user.data().signupMode === 'xumm'){
					const token = await generateToken({address: user.id, expiry: Date.now() + 1000 * 60 * 60 * 24})
					req.io.emit('accountLoggedIn', {status: 'success', token: token, address: user.id, data:user.data()})
				}else if(user.exists){
					req.io.emit('accountLoggedIn', {status: 'failed', exists: true, signupMode: user.data().signupMode, message: 'Account already exists but not created with Xumm'})
				}else{
					req.io.emit('accountLoggedIn', {status: 'failed', exists: false, message: 'Account does not exist'})
				}
			}
		})
		res.json({uuid: subscription.created.uuid, url: `https://xumm.app/sign/${subscription.created.uuid}`, wss: `wss://xumm.app/sign/${subscription.created.uuid}`})
	},
	getUserData: async (req, res) => {
		res.status(200).json(req.user)
	},

    createAccountWithOAuth: async (req, res) => {
        const transaction = {
			txjson: {
				TransactionType: "SignIn",
			}
		}
    },
	loginAccountWithOAuth: async (req, res) => {
		
	},
}