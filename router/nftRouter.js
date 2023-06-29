const router = require('express').Router()
const db = require('../utils/firebase')

module.exports = (io) => {
    router.get('/', (req, res) => {
        db.collection('nfts').onSnapshot(snapshot => {
            var resData = snapshot.docs.map(doc => {
                return {id:doc.id, ...doc.data()}
            })
            res.json(resData)
        })
    })
    
    return router
}