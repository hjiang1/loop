var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid')
var moment = require('moment')

//Editing post
router.post('/posts/:id/edit', function(req, res) {
	// Post.findById(req.params.id, function(error, post) {
	// 	if (error)
	// 		throw error;
	// 	if (req.body.title) {
	// 		post.title = req.body.title
	// 	}
	// 	if (req.body.text) {
	// 		post.text = req.body.text
	// 	}
	// 	post.save(function(error, updatedPost) {
	// 		if (error)
	// 			throw error;
	// 		res.redirect('/boards/'+updatedPost.board)
	// 	})
	// })
})

//Deleting post
router.post('/posts/:id/delete', function(req, res) {
	// Post.findById(req.params.id, function(error, post) {
	// 	if (error)
	// 		throw error;
	// 	Board.findById(post.board, function(error, board) {
	// 		if (error)
	// 			throw error;
	// 		var boardPosts = board.posts
	// 		var index = boardPosts.indexOf(post._id)
	// 		board.posts = boardPosts.slice(0, index).concat(boardPosts.slice(index+1, boardPosts.length))
	// 		board.save(function(error, updatedBoard) {
	// 			if (error)
	// 				throw error;
	// 			res.redirect('/boards/'+updatedBoard._id)
	// 		})
	// 	})
	// })
})

//Commenting on post
router.post('/posts/:id/comment', function(req, res) {
  var post = Realm.objects('Post').filtered(`id="${req.params.id}"`)[0]
  var postComments = Object.keys(post.comments).map(function (key) {
    return post.comments[key];
  });  
  var userComments = Object.keys(req.user.comments).map(function (key) {
    return req.user.comments[key];
  });  
  var id = shortid.generate()  
  Realm.write( () => {
    Realm.create('Comment', {
      id: id,
      postedBy: req.user,
      post: post,
      text: req.body.text
    });
  });
  var newComment = Realm.objects('Comment').filtered(`id="${id}"`)[0]
  postComments.push(newComment)
  userComments.push(newComment)
  Realm.write(() => {
    Realm.create('Post', {id: req.params.id, comments: postComments}, true);
  });
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, comments: userComments}, true);
  });
  res.redirect('back')
})

module.exports = router;