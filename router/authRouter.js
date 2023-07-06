const router = require('express').Router()
const {createAccountWithXumm, createAccountWithOAuth, loginAccountWithXumm, loginAccountWithOAuth, getUserData} = require('../controllers/authController')
const {verifyToken} =require('../middlewares/verifyJWT')

router.get('/getUserData', verifyToken, getUserData)

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

router.get('/createAccountWithOAuth', createAccountWithOAuth)
router.get('/loginAccountWithOAuth', loginAccountWithOAuth)

module.exports = router;