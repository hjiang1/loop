var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid')
var moment = require('moment')

//Editing comment
router.post('/comments/:id/edit', function(req, res) {
})


//Deleting comment
router.post('/comments/:id/delete', function(req, res) {

})

//Commeting on comment
router.post('/comments/:id/comment', function(req, res) {
  var comment = Realm.objects('Comment').filtered(`id="${req.params.id}"`)[0]
  var commentComments = Object.keys(comment.comments).map(function (key) {
    return comment.comments[key];
  });  
  var userComments = Object.keys(req.user.comments).map(function (key) {
    return req.user.comments[key];
  });
  var id = shortid.generate()  
  Realm.write( () => {
    Realm.create('Comment', {
      id: id,
      postedBy: req.user,
      text: req.body.text
    });
  });
  var newComment = Realm.objects('Comment').filtered(`id="${id}"`)[0]
  commentComments.push(newComment)
  userComments.push(newComment)
  Realm.write(() => {
    Realm.create('Comment', {id: req.params.id, comments: commentComments}, true);
  });
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, comments: userComments}, true);
  });
  res.redirect('back')
})


module.exports = router;