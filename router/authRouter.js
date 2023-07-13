const router = require('express').Router()
const {createAccountWithXumm, createAccountWithOAuth, loginAccountWithXumm, loginAccountWithOAuth, getUserData} = require('../controllers/authController')
const {verifyToken} =require('../middlewares/verifyJWT')

router.get('/getUserData', verifyToken, getUserData)

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

router.post('/createAccountWithOAuth', createAccountWithOAuth)
router.post('/loginAccountWithOAuth', loginAccountWithOAuth)

module.exports = router;