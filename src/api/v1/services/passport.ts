import {Passport} from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportTwitter from 'passport-twitter';
import passportDiscord from 'passport-discord'
import db from '../helpers/firebase';

// New passport instance and strategies
const passport = new Passport();
const GoogleStrategy = passportGoogle.Strategy;
const TwitterStrategy = passportTwitter.Strategy;
const DiscordStrategy = passportDiscord.Strategy;

// Serialize and deserialize user
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

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/auth/google/redirect',
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

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
    callbackURL: '/api/auth/twitter/redirect',
    includeEmail: true
}, (accessToken, refreshToken, profile: any, done) => {
    db.collection('users').where('email', "==", profile.emails[0].value).get().then(async (snapshot) => {
        if (snapshot.empty) {
            const userData = {
                profileId: profile.id,
                twitterUserName: profile.username,
                name: profile.displayName,
                email: profile.emails[0].value,
                token: accessToken || refreshToken,
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

// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    callbackURL: '/api/auth/discord/redirect',
}, (accessToken, refreshToken, profile: any, done: any) => {
    db.collection('users').where('email', "==", profile.email).get().then(async (snapshot) => {
        if (snapshot.empty) {
            const userData = {
                profileId: profile.id,
                discordUsername: profile.username,
                name: profile.username,
                email: profile.email,
                token: accessToken || refreshToken,
                provider: 'discord'
            };
            const docRef = await db.collection('users').add(userData)
            docRef.get().then((doc) => {
                done(null, {id: docRef.id, ...doc.data()});
            }).catch(err => {
                done(err, false);
            });
        } else {
            if(snapshot.docs[0].data().provider !== 'discord') {
                done('Email already in use with another provider', undefined);
            }
            done(null, { id: snapshot.docs[0].id, ...snapshot.docs[0].data()});
        }
    }).catch((err) => {
        done(err, undefined);
    });
}));

export default passport;