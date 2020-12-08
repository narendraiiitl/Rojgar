const passport = require("passport");
const googlestrategy = require("passport-google-oauth20");
const bcrypt = require("bcrypt");
const User = require("../model/Users");
const { clientID, clientSecret } = require("../Config/keys");

passport.use(
  new googlestrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: clientID,
      clientSecret: clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((currentuser) => {
        if (currentuser) {
          done(null, currentuser);
        } else {
          new User({
            username: profile.displayName,
            googleID: profile.id,
            email: profile.emails[0].value,
            verified: profile.emails[0].verified,
          })
            .save()
            .then((newuser) => {
              console.log("new user created" + newuser);
              done(null, newuser);
            });
        }
      });
    }
  )
);
