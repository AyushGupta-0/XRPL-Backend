import {Router} from 'express'
import {createOrLoginXumm, createAccountAfterOAuth, getProfile} from '../controllers/auth'
// import checkAuthentication from '../middlewares/checkAuthentication'
import passport from '../services/passport'
import ApiRequest from '../interfaces/ApiRequest'
import verifyToken from '../middlewares/verifyJWT'
import generateToken from '../helpers/jwt'
const router: Router = Router()


// @route     GET /api/auth/xumm
// @desc      Get Xumm payload for creating or logging into account
// @access    Public
router.get('/xumm', createOrLoginXumm)

// @route     GET /api/auth/createAccountAfterOAuth
// @desc      Update account details after OAuth
// @access    Restricted (Only for users who have logged in with OAuth)
router.post('/createAccountAfterOAuth', verifyToken, createAccountAfterOAuth)

// @route     GET /api/auth/profile
// @desc      Get user profile details
// @access    Private
router.get('/profile', verifyToken, getProfile)

// @route     GET /api/auth/google
// @desc      OAuth screen for google
// @access    Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?success=false`,
    session: false
}), (req: ApiRequest, res) => {
    const token = generateToken(req.user.id)
    if(req.user.defaultWallet){
        res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=dashboard`)
    }
    res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=continue-form`)
});

// @route     GET /api/auth/twitter
// @desc      OAuth screen for twitter
// @access    Public
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/redirect', passport.authenticate('twitter', {
    failureRedirect: `${process.env.CLIENT_URL}/login?success=false`,
    session: false
}), (req: ApiRequest, res) => {
    const token = generateToken(req.user.id)
    if(req.user.defaultWallet){
        res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=dashboard`)
    }
    res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=continue-form`)
});

// @route     GET /api/auth/discord
// @desc      OAuth screen for discord
// @access    Public
router.get('/discord', passport.authenticate('discord', {scope: ['identify', 'email']}));
router.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: `${process.env.CLIENT_URL}/login?success=false`,
    session: false
}), (req: ApiRequest, res) => {
    const token = generateToken(req.user.id)
    if(req.user.defaultWallet){
        res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=dashboard`)
    }
    res.redirect(`${process.env.CLIENT_URL}/setToken?token=${token}&next=continue-form`)
});


export default router