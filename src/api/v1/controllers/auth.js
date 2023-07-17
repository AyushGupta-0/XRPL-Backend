const {fetchBalance} = require('../helpers/xrpl')
const xumm = require('../helpers/xumm')
const db = require('../helpers/firebase')
const {generateToken} = require('../helpers/jwt')

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
					const balance = await fetchBalance(payload.response.account)
					const token = await generateToken({address: user.id, expiry: Date.now() + 1000 * 60 * 60 * 24})
                    req.io.emit('accountCreated', {status: 'success', token: token, address: user.id, balance, data:user.data()})
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
					const balance = await fetchBalance(payload.response.account)
					const token = await generateToken({address: user.id, expiry: Date.now() + 1000 * 60 * 60 * 24})
                    req.io.emit('accountLoggedIn', {status: 'success', token: token, address: user.id, balance, data:user.data()})
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
		if(req.body.username && req.body.bio && req.body.email && req.body.provider){
			const transaction = {
				txjson: {
					TransactionType: "SignIn",
				}
			}
			const subscription = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
				if(event.data.signed){
					const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)				
					const userRef = await db.collection('users').doc(payload.response.account)
					var user = await userRef.get()
					if(user.exists && user.data().signupMode === req.body.provider){
						req.io.emit('accountCreated', {status: 'failed', signupMode: req.body.provider, message: 'Account already exists'})
					}else if(user.exists){
						req.io.emit('accountCreated', {status: 'failed', signupMode: user.data().signupMode, message: `Account already exists but not created using ${req.body.provider}`})
					}else{
						const doc = await userRef.set({
							username: req.body.username,
							bio: req.body.bio,
							email: req.body.email,
							user_token: payload.application.issued_user_token,
							created: new Date(),
							updated: new Date(),
							signupMode: req.body.provider,
						})
						user = await userRef.get()
						const token = await generateToken({address: user.id, expiry: Date.now() + 1000 * 60 * 60 * 24})
						req.io.emit('accountCreated', {status: 'success', token: token, address: user.id, data:user.data()})
					}
				}
			})
			res.json({uuid: subscription.created.uuid, url: `https://xumm.app/sign/${subscription.created.uuid}`, wss: `wss://xumm.app/sign/${subscription.created.uuid}`})
		}else{
			res.status(400).json({message: 'Bad Request'})
		}
    },
	loginAccountWithOAuth: async (req, res) => {
		
	},
}