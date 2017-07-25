var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  // Retrieve registration page
  router.get('/signup', function(req, res) {
    res.render('signup',{message: req.flash('signupMessage')});
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the main page
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }))
  // Retrieve login page
  router.get('/login', function(req, res) {
    res.render('login', {message: req.flash('loginMessage')})
  });

  // Processs the login form
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the main page
    failureRedirect : '/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
  }));

  // Logout
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // // Retrieve settings page
  // router.get('/settings', function(req, res) {
  //   res.render('settings', {email: req.user.email, message: req.flash('settingsMessage')})
  // });

  // // Process settings page
  // router.post('/settings', passport.authenticate('local-settings', {
  //   successRedirect : '/login', // redirect to the login page
  //   failureRedirect : '/settings', // redirect back to the login page if there is an error
  //   failureFlash : true // allow flash messages
  // }));

  return router;
};