var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid');

router.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    var realmBoards = Realm.objects('Board')
    var userBoards = Realm.objects('User').filtered(`id="${req.user.id}"`)[0].subscribedBoards
    var userBoardsIds = Object.keys(userBoards).map(function (key) {
      return userBoards[key].id;
    });
    var boards = [];
    for (var i=0; i<realmBoards.length; i++) {
      if (userBoardsIds.indexOf(realmBoards[i].id)>-1) {
        boards.push({"subscribed": true, "board": realmBoards[i]})
      } else {
        boards.push({"subscribed": false, "board": realmBoards[i]})
      }
    }
    res.render('authHome', {id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName, boards: boards})
  } else {       
    res.render('generalHome')
  }
});

module.exports = router;