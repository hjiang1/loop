var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var Realm = require('../models/realm');
var shortid = require('shortid');
var bcrypt   = require('bcrypt-nodejs');
//Passport session setup ============================================================================================================================================================

//Serialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserialization
passport.deserializeUser(function(id, done) {
  var user = Realm.objects('User').filtered(`id = "${id}"`)[0]
  done(null, user);
});

//Sign Up =================================================================================================================================================================
passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },  
  function(req, username, password, done) {
    // Asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // Find a user whose email is the same as the forms email and check to see if the user trying to login has made an account
      var users = Realm.objects('User').filtered(`username = "${username}"`)
      console.log("users", users)
      if (users.length > 0) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else if (!username.includes("@haverford.edu")) {
        return done(null, false, req.flash('signupMessage', 'Your username must be a valid Haverford email address.'))
      } else if (req.body.password !== req.body.confirmPassword) {
        return done(null, false, req.flash('signupMessage', 'Passwords don\'t match.'));
      } else {
        Realm.write( () => {
          Realm.create('User', {
            id: shortid.generate(),
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
            firstName: req.body.firstName,
            lastName: req.body.lastName
          });
        });
        var newUser = Realm.objects('User').filtered(`username = "${username}"`)[0]
        console.log("newUser", newUser)
        return done(null, newUser);
      }     
    });
  }
));  


//Login =============================================================================================================================================================================
passport.use('local-login', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },  
  function(req, username, password, done) {
    // Asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // Find a user whose email is the same as the forms email and check to see if the user trying to sign up already exists
      var user = Realm.objects('User').filtered(`username = "${username}"`)[0]
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'There is no user with email.'))
      } else if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('loginMessage', 'Password is incorrect'))
      } else {
        //Found the user and logs the user in          
        return done(null, user)
      }
    });  
}));

//Export passport ===================================================================================================================================================================
module.exports = passport;