const uploadToIPFS = require('../utils/ipfs')
const {xumm} = require('../utils/xumm')
const db = require('../utils/firebase')


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
					req.io.emit('accountCreated', {status: 'failed', signupMode: user.data().signupMode, message: 'Account already exists but not created with Xumm.'})
				}else{
					const doc = await userRef.set({
						user_token: payload.application.issued_user_token,
						created: new Date(),
						updated: new Date(),
						signupMode: 'xumm'
					})
					user = await userRef.get()
                    req.io.emit('accountCreated', {status: 'success', address: user.id, data:user.data()})
				}
			}
		})
		console.log(subscription.created.pushed)
		res.json(subscription)
	},

    createAccountWithOAuth: async (req, res) => {
        
    }
}