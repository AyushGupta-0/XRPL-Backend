import {Router} from 'express'
import {createAccountWithXumm, loginAccountWithXumm, createAccountWithOAuth, loginAccountWithOAuth, getProfile} from '../controllers/auth'
const router: Router = Router()

router.get('/profile', getProfile)

router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

router.post('/createAccountWithOAuth', createAccountWithOAuth)
router.post('/loginAccountWithOAuth', loginAccountWithOAuth)

router.get('/logout', function(req, res, next) {
    res.clearCookie('SESSION_COOKIE');
    res.json({message: 'logged out'})
});

export default router