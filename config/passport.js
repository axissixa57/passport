const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    // email, password - считываются из req.body (by names of inputs from a form)
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
            // passport запишет usera из bd в объект req.user
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );
  passport.use(
    new GithubStrategy(
      {
        clientID: "50685ea8379c055b4bb3",
        clientSecret: "fd51a30c6ed99cfa1064492d9261e182fceefc5c",
        callbackURL: "http://localhost:5000/auth/github/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        return (
          User.findOne({ githubId: profile.id })
            .then(user =>
              user
                ? user
                : new User({
                    githubId: profile.id,
                    name: profile.username
                  }).save()
            )
            .then(data => {
              done(null, data)
            })
            .catch(err => done(null, false, { message: err }))
        );
      }
    )
  );

  // Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made.

  // Passport does not impose any restrictions on how your user records are stored. Instead, you provide functions to Passport which implements the necessary serialization and deserialization logic. In a typical application, this will be as simple as serializing the user ID, and finding the user by ID when deserializing.

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
