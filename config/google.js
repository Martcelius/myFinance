const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../model/user');

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