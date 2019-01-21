const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../model/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        'local.email': email
    }, (err, user) => {
        if (err) {
            return done(err);
        };
        if (user) {
            return done(null, false, {
                message: 'Email already use!!'
            });
        };
        let newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.encryptPassword(password);
        newUser.local.username = req.body.username;
        newUser.save((err, user) => {
            if (err) {
                return done(err);
            };
            return done(null, user);
        });
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        'local.email': email
    }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'Invalid email or password'
            })
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Invalid Data'
            })
        }
        return done(null, user);
    });
}));



//passport facebook

passport.use(new FacebookStrategy({
    clientID: '1727585850675887',
    clientSecret: 'd5f85fd71fdf659661c35e54591e1544',
    callbackURL: "http://localhost:3000/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({
        'facebook.id': profile.id
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }
        let newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = accessToken;
        newUser.facebook.name = profile.displayName;
        newUser.facebook.email = profile.emails[0].value;
        newUser.save((err, user) => {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    });
}));


//passport google

passport.use(new GoogleStrategy({
        clientID: '332770785746-bc7t78r7an6jqg0td3gju9ous6gi2i0a.apps.googleusercontent.com',
        clientSecret: 'BCBBdCiFf9DQPVs3hU7BEVaF',
        callbackURL: "http://localhost:3000/user/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            'google.id': profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user)
            }
            let newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.save((err, user) => {
                if (err) {
                    return done(err);
                }
                return done(null, user);
            })
        });
    }
));


module.exports = passport;