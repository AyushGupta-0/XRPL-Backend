import {Router} from 'express'
import {createAccountWithXumm, loginAccountWithXumm, createAccountWithOAuth, getProfile} from '../controllers/auth'
import checkAuthentication from '../middlewares/checkAuthentication'
import passport from '../services/passport'
const router: Router = Router()



// @route     GET /api/auth/profile
// @desc      Get user profile details
// @access    Private
router.get('/profile', checkAuthentication, getProfile)


// TODO: Need to integrate this with express-sessions
router.get('/createAccountWithXumm', createAccountWithXumm)
router.get('/loginAccountWithXumm', loginAccountWithXumm)

// TODO: Post form after OAuth completion for the first time
router.post('/createAccountWithOAuth', checkAuthentication, createAccountWithOAuth)


// @route     GET /api/auth/logout
// @desc      Logout user and clear session cookie
// @access    Public
router.get('/logout', function(req, res) {
    req.session.destroy((err) => {
        if(err) console.log(err)
        res.clearCookie('SESSION_COOKIE');
        res.redirect(`${process.env.CLIENT_URL}/?logout=true`)
    })
});



// @route     GET /api/auth/google
// @desc      OAuth screen for google
// @access    Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/?success=false`,
    successRedirect: `${process.env.CLIENT_URL}/?success=true`
}));

// @route     GET /api/auth/twitter
// @desc      OAuth screen for twitter
// @access    Public
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/redirect', passport.authenticate('twitter', {
    failureRedirect: `${process.env.CLIENT_URL}/?success=false`,
    successRedirect: `${process.env.CLIENT_URL}/?success=true`
}));

// @route     GET /api/auth/discord
// @desc      OAuth screen for discord
// @access    Public
router.get('/discord', passport.authenticate('discord', {scope: ['identify', 'email']}));
router.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: `${process.env.CLIENT_URL}/?success=false`,
    successRedirect: `${process.env.CLIENT_URL}/?success=true`
}));





// These routes below will be removed and redirects above would be changed to the frontend
// router.get('/google/success', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })
// router.get('/google/failed', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })
// router.get('/twitter/success', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })
// router.get('/twitter/failed', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })
// router.get('/discord/success', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })
// router.get('/discord/failed', (req, res) => {
//     res.json({session: req.session, id: req.sessionID, user: req.user})
// })

export default router