import { Router } from 'express'
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportTwitter from 'passport-twitter';
import db from '../helpers/firebase';
import User from '../interfaces/User';
const router: Router = Router()
const GoogleStrategy = passportGoogle.Strategy;
const TwitterStrategy = passportTwitter.Strategy;

passport.serializeUser(function(doc:any, cb) {
    process.nextTick(function() {
        return cb(null, doc.id);
    });
});
  
passport.deserializeUser(function(id: string, cb) {
    process.nextTick(function() {
        db.collection('users').doc(id).get().then((doc) => {
            return cb(null, {id, ...doc.data()});
        }).catch(err => {
            return cb(err, false)
        })
    });
});
  



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: 'http://localhost:5000/api/oauth/google/redirect',
}, (accessToken, refreshToken, profile: any, done) => {
    db.collection('users').where('email', "==", profile.emails[0].value).get().then(async (snapshot) => {
        if (snapshot.empty) {
            const userData = {
                profileId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                token: accessToken || refreshToken,
                provider: 'google'
            };
            const docRef = await db.collection('users').add(userData)
            docRef.get().then((doc) => {
                done(null, {id: docRef.id, ...doc.data()});
            }).catch(err => {
                done(err, false);
            });
        } else {
            if(snapshot.docs[0].data().provider !== 'google') {
                done('Email already in use with another provider', undefined);
            }
            done(null, { id: snapshot.docs[0].id, ...snapshot.docs[0].data()});
        }
    }).catch((err) => {
        done(err, undefined);
    });
}));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
    callbackURL: 'http://localhost:5000/api/oauth/twitter/redirect',
}, (token, tokenSecret, profile: any, done) => {
    console.log(profile, token, tokenSecret)
    db.collection('users').where('twitterUserName', "==", profile.username).get().then(async (snapshot) => {
        if (snapshot.empty) {
            const userData = {
                profileId: profile.id,
                twitterUserName: profile.username,
                name: profile.displayName,
                token: token || tokenSecret,
                provider: 'twitter'
            };
            const docRef = await db.collection('users').add(userData)
            docRef.get().then((doc) => {
                done(null, {id: docRef.id, ...doc.data()});
            }).catch(err => {
                done(err, false);
            });
        } else {
            if(snapshot.docs[0].data().provider !== 'twitter') {
                done('Email already in use with another provider', undefined);
            }
            done(null, { id: snapshot.docs[0].id, ...snapshot.docs[0].data()});
        }
    }).catch((err) => {
        done(err, undefined);
    });
}));



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/api/oauth/google/failed',
    successRedirect: '/api/oauth/google/success'
}));


// These two routes below will be removed and redirects above would be changed to the frontend
router.get('/google/success', (req, res) => {
    res.json({session: req.session, id: req.sessionID, user: req.user})
})
router.get('/google/failed', (req, res) => {
    res.json({session: req.session, id: req.sessionID, user: req.user})
})


router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect', passport.authenticate('twitter', {
    failureRedirect: '/api/oauth/twitter/failed',
    successRedirect: '/api/oauth/twitter/success'
}));


// These two routes below will be removed and redirects above would be changed to the frontend
router.get('/twitter/success', (req, res) => {
    res.json({session: req.session, id: req.sessionID, user: req.user})
})
router.get('/twitter/failed', (req, res) => {
    res.json({session: req.session, id: req.sessionID, user: req.user})
})


export default router