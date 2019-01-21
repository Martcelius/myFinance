const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/user');


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     })
// });


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
        newUser.save((err) => {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

module.exports = passport;