const db = require('../helpers/firebase')
const uploadToIPFS = require('../helpers/ipfs')

module.exports = {
    getAllNFTs: (req, res) => {
        db.collection('nfts').onSnapshot(snapshot => {
            var resData = snapshot.docs.map(doc => {
                return {id:doc.id, ...doc.data()}
            })
            res.json(resData)
        })
    }
}