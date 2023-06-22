const router = require('express').Router()
const xumm = require('../utils/xumm')

var authRouter = (io) => {
	router.get('/createSignInPayload', async (req, res) => {
		const transaction = {
			TransactionType: "SignIn",

		}
		const subscription = await xumm.payload?.createAndSubscribe(transaction, async (event) => {
			if(event.data.signed){
				const payload = await xumm.payload?.get(event.data.payload_uuidv4, true)
				console.log(payload)
				io.emit('signed', { signed: true, payload: payload })
			}
		})

		res.json(subscription)
	})
	router.post('/login', async (req, res) => {
		
	})
	return router;
}

module.exports = authRouter