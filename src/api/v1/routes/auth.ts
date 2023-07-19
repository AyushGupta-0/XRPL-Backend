import {Router} from 'express'
import {createAccountWithXumm, loginAccountWithXumm, createAccountWithOAuth, loginAccountWithOAuth, getProfile} from '../controllers/auth'
import verifyToken from '../middlewares/verifyJWT'
const router: Router = Router()

router.get('/profile', verifyToken, getProfile)

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

router.post('/createAccountWithOAuth', createAccountWithOAuth)
router.post('/loginAccountWithOAuth', loginAccountWithOAuth)

export default router