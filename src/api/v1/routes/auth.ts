import {Router} from 'express'
import {createAccountWithXumm, loginAccountWithXumm, createAccountWithOAuth, loginAccountWithOAuth, getProfile} from '../controllers/auth'
import checkAuthentication from '../middlewares/checkAuthentication'
const router: Router = Router()

router.get('/profile', checkAuthentication, getProfile)

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

router.post('/createAccountWithOAuth', createAccountWithOAuth)
router.post('/loginAccountWithOAuth', loginAccountWithOAuth)

router.get('/logout', function(req, res, next) {
    res.clearCookie('SESSION_COOKIE');
    res.json({message: 'logged out'})
});

export default router