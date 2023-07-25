import { Router } from 'express'
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import db from '../helpers/firebase';
import User from '../interfaces/User';
const router: Router = Router()
const GoogleStrategy = passportGoogle.Strategy;


passport.serializeUser(function(user:any, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});
  
passport.deserializeUser(function(user: any, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});
  

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: 'http://localhost:5000/api/oauth/google/redirect',
}, (accessToken, refreshToken, profile: any, done) => {
    db.collection('users').where('email', "==", profile.emails[0].value).get().then((snapshot) => {
        if (snapshot.empty) {
            const userData = {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                token: accessToken || refreshToken,
                provider: 'google'
            };
            db.collection('users').add(userData).then((doc) => {
                done(null, userData);
            }).catch(err => {
                done(err, undefined);
            });
        } else {
            if(snapshot.docs[0].data().provider !== 'google') {
                done('Email already in use', undefined);
            }
            done(null, snapshot.docs[0].data());
        }
    }).catch((err) => {
        done(err, undefined);
    });
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/api/oauth/google/failed',
}), (req, res) => {
    const token = req.session.passport.user.token;
    res.cookie('SESSION_COOKIE', token, {
        maxAge: 1000 * 60 * 60 * 3,
        secure: true,
        httpOnly: true
    })
    res.redirect("/api/oauth/google/success");
});

router.get('/google/success', (req, res) => {
    console.log(req.session)
    console.log(req.sessionID)
    console.log(req.user)
    console.log(req.cookies)
    
    res.json({session: req.session, id: req.sessionID, user: req.user})
})
router.get('/google/failed', (req, res) => {
    console.log(req.session)

    console.log(req.sessionID)
    console.log(req.user)
    res.json({session: req.session, id: req.sessionID, user: req.user})
})

export default router