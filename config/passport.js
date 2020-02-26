const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const SteamStrategy = require("passport-steam").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            // req.user
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );
  // Passport strategy for authenticating with GitHub using the OAuth 2.0 API
  passport.use(
    new GithubStrategy(
      {
        clientID: "50685ea8379c055b4bb3",
        clientSecret: "fd51a30c6ed99cfa1064492d9261e182fceefc5c",
        callbackURL: "http://localhost:5000/auth/github/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        return User.findOne({ githubId: profile.id })
          .then(user =>
            user
              ? user
              : new User({
                  githubId: profile.id,
                  name: profile.username
                }).save()
          )
          .then(data => {
            done(null, data);
          })
          .catch(err => done(null, false, { message: err }));
      }
    )
  );
  // Passport strategy for authenticating with Steam using OpenID 2.0.
  passport.use(
    new SteamStrategy(
      {
        returnURL: "http://localhost:5000/auth/steam/return",
        realm: "http://localhost:5000/",
        // apiKey: "43204A5A61A92029F3FA74E2C6D78842" // for receive profile data
      },
      function(identifier, profile, done) {
        // identifier (OpenID identifier) = https://steamcommunity.com/openid/id/76561198020726188
        // profile = {provider: 'steam', _json: {}, id: '76561198020726188', displayName: 'nick', photos: [{},{},{}]}

        return User.findOne({ steamId: profile.id })
          .then(user =>
            user
              ? user
              : new User({
                  steamId: profile.id,
                  name: profile.displayName,
                  photos: profile.photos
                }).save()
          )
          .then(data => {
            done(null, data);
          })
          .catch(err => done(null, false, { message: err }));
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
