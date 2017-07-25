var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid')
var moment = require('moment')

//Retrieving a board page
router.get('/boards/:id', function(req, res) {
  var realmBoard = Realm.objects('Board').filtered(`id="${req.params.id}"`)[0]
  console.log("realmBoard", realmBoard.name)
  if (realmBoard.name === 'Event') {
    console.log("here")
    var userEventIds = Object.keys(req.user.createdEvents).map(function (key) {
      return req.user.createdEvents[key].id;
    });
    var userAttendedEventIds = Object.keys(req.user.attendedEvents).map(function (key) {
      return req.user.attendedEvents[key].id
    })
    var userCommentIds = Object.keys(req.user.comments).map(function (key) {
      return req.user.comments[key].id;
    });
    var events = [];
    for (var i=0; i<realmBoard.events.length; i++) {
      var comments = [];
      for (var j=0; j<realmBoard.events[realmBoard.events.length-1-i].comments.length; j++) {
        var commentsOfComments = []
        for (var k=0; k<realmBoard.events[realmBoard.events.length-1-i].comments[j].comments.length; k++) {
          if (userCommentIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k]) > -1) {
            commentsOfComments.push({"own": true, "comment": {
              "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].id,
              "createdAt": moment(realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].createdAt).format('LLL'),
              "postedBy": {
                "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].id,
                "firstName": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].firstName,
                "lastName": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].lastName            
              },
              "text": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].text
            }})
          } else {
            commentsOfComments.push({"own": true, "comment": {
              "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].id,
              "createdAt": moment(realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].createdAt).format('LLL'),
              "postedBy": {
                "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].id,
                "firstName": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].firstName,
                "lastName": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].postedBy[0].lastName            
              },
              "text": realmBoard.events[realmBoard.events.length-1-i].comments[j].comments[k].text
            }})
          }          
        }
        if (userCommentIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].comments[j].id) > -1) {
          comments.push({"own": true, "comment": {
            "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].id,
            "createdAt": moment(realmBoard.events[realmBoard.events.length-1-i].comments[j].createdAt).format('LLL'),
            "postedBy": {
              "id": realmBoard.events[realmBoard.events.length-1-i].comments[j]].postedBy[0].id,
              "firstName": realmBoard.events[realmBoard.events.length-1-i].comments[j].postedBy[0].firstName,
              "lastName": realmBoard.events[realmBoard.events.length-1-i].comments[j].postedBy[0].lastName            
            },
            "text": realmBoard.events[realmBoard.events.length-1-i].comments[j].text,
            "comments": commentsOfComments
          }})
        } else {
          comments.push({"own": false, "comment": {
            "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].id,
            "createdAt": moment(realmBoard.events[realmBoard.events.length-1-i].comments[j].createdAt).format('LLL'),
            "postedBy": {
              "id": realmBoard.events[realmBoard.events.length-1-i].comments[j].postedBy[0].id,
              "firstName": realmBoard.events[realmBoard.events.length-1-i].comments[j].postedBy[0].firstName,
              "lastName": realmBoard.events[realmBoard.events.length-1-i].comments[j].postedBy[0].lastName            
            },
            "text": realmBoard.events[realmBoard.events.length-1-i].comments[j].text,
            "comments": commentsOfComments
          }})
        }        
      }
      if (userEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id)>-1 && userAttendedEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id) >-1) {
        events.push({
          "own": true,
          "attending": true,
          "event": {

          }
        })
      } else if (userEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id)>-1 && userAttendedEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id) === -1) {
        events.push({
          "own": true,
          "attending": false,
          "event": {

          }
        })
      } else if (userEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id)===-1 && userAttendedEventIds.indexOf(realmBoard.events[realmBoard.events.length-1-i].id) >-1) {
        events.push({
          "own": false,
          "attending": true,
          "event": {

          }
        })
      } else {
        events.push({
          "own": false,
          "attending": false,
          "event": {

          }
        })
      }
    }
  } else if (realmBoard.name === 'Challenge') {
    console.log("here")
  } else {
    var userPostIds = Object.keys(req.user.posts).map(function (key) {
      return req.user.posts[key].id;
    });
    var userCommentIds = Object.keys(req.user.comments).map(function (key) {
      return req.user.comments[key].id;
    });
    var posts = []
    for (var i=0; i<realmBoard.posts.length; i++) {
      var comments = []
      for (var j=0; j<realmBoard.posts[realmBoard.posts.length-1-i].comments.length; j++) {
        var commentsOfComments = []
        for (var k=0; k<realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments.length; k++) {
          if (userCommentIds.indexOf(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k]) > -1) {
            commentsOfComments.push({"own": true, "comment": {
              "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].id,
              "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].createdAt).format('LLL'),
              "postedBy": {
                "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].id,
                "firstName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].firstName,
                "lastName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].lastName            
              },
              "text": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].text
            }})
          } else {
            commentsOfComments.push({"own": true, "comment": {
              "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].id,
              "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].createdAt).format('LLL'),
              "postedBy": {
                "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].id,
                "firstName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].firstName,
                "lastName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].postedBy[0].lastName            
              },
              "text": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].comments[k].text
            }})
          }
        }
       console.log("commentsOfComments", commentsOfComments)
        if (userCommentIds.indexOf(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].id) > -1) {
          comments.push({"own": true, "comment": {
            "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].id,
            "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].createdAt).format('LLL'),
            "postedBy": {
              "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].id,
              "firstName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].firstName,
              "lastName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].lastName            
            },
            "text": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].text,
            "comments": commentsOfComments
          }})
        } else {
          comments.push({"own": false, "comment": {
            "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].id,
            "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].comments[j].createdAt).format('LLL'),
            "postedBy": {
              "id": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].id,
              "firstName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].firstName,
              "lastName": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].postedBy[0].lastName            
            },
            "text": realmBoard.posts[realmBoard.posts.length-1-i].comments[j].text,
            "comments": commentsOfComments
          }})
        }
      }
      if (userPostIds.indexOf(realmBoard.posts[realmBoard.posts.length-1-i].id)>-1) {
        posts.push({"own": true, "post": {
          "id": realmBoard.posts[realmBoard.posts.length-1-i].id,
          "title": realmBoard.posts[realmBoard.posts.length-1-i].title,
          "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].createdAt).format('LLL'),
          "postedBy": {
            "id": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].id,
            "firstName": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].firstName,
            "lastName": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].lastName
          },
          "content": realmBoard.posts[realmBoard.posts.length-1-i].content,
          "comments": comments
        }})
      } else {
        posts.push({"own": false, "post": {
          "id": realmBoard.posts[realmBoard.posts.length-1-i].id,
          "title": realmBoard.posts[realmBoard.posts.length-1-i].title,
          "createdAt": moment(realmBoard.posts[realmBoard.posts.length-1-i].createdAt).format('LLL'),
          "postedBy": {
            "id": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].id,
            "firstName": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].firstName,
            "lastName": realmBoard.posts[realmBoard.posts.length-1-i].postedBy[0].lastName
          },        
          "content": realmBoard.posts[realmBoard.posts.length-1-i].content,
          "comments": comments
        }})
      }
    }
    res.render('generalBoard', {boardId: req.params.id, posts: posts})
  }
})

//Making a post on a board
router.post('/boards/:id/post', function(req, res) {
  var board = Realm.objects('Board').filtered(`id="${req.params.id}"`)[0]
  var boardPosts = Object.keys(board.posts).map(function (key) {
    return board.posts[key];
  });  
  var userPosts = Object.keys(req.user.posts).map(function (key) {
    return req.user.posts[key];
  });  
  var id = shortid.generate()  
  Realm.write( () => {
    Realm.create('Post', {
      id: id,
      postedBy: req.user,
      board: board,
      createdAt: new Date(),
      title: req.body.title,
      content: req.body.content
    });
  });
  var newPost = Realm.objects('Post').filtered(`id="${id}"`)[0]
  boardPosts.push(newPost)
  userPosts.push(newPost)
  Realm.write(() => {
    Realm.create('Board', {id: req.params.id, posts: boardPosts}, true);
  });
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, posts: userPosts}, true);
  });  
  res.redirect('/boards/'+req.params.id)
})

// //Making an event on the event page
// router.post('/boards/:id/event', function(req, res) {
//   var newEvent = new Event({
//     postedBy: req.user._id,
//     name: req.body.name,
//     startTime: req.body.startTime,
//     endTime: req.body.endTime,
//     location: req.body.location,
//     text: req.body.text
//   })

//   var newNotification = new Notification({
//     recipient: req.user._id,
//     message: 'Your event has been made on Loop. Please assign it to a board.'
//   })


//   newEvent.save(function(error, newEvent) {
//     if (error)
//       throw error;
//     newNotification.save(function(error, newNotification) {
//       if (error)
//         throw error;
//       User.findById(req.user._id, function(error, user) {
//         if (error)
//           throw error;
//         user.createdEvents.push(newEvent._id)
//         user.notifications.push(newNotification._id)
//         user.save(function(error, updatedUser) {
//           if (error)
//             throw error
//           Board.findOne({name: 'Event'}, function(error, board) {
//             console.log("BOARD", board)
//             if (error)
//               throw error
//             board.events.push(newEvent._id)
//             board.save(function(error, updatedBoard) {
//               if (error)
//                 throw error
//               res.redirect('/boards/'+updatedBoard._id)
//             })
//           })
//         })
//       })
//     })
//   })
// })


// //Making a challenge on the challenge page
// router.post('/boards/:id/challenge', function(req, res) {
//   var newChallenge = new Challenge({
//     postedBy: req.user._id,
//     name: req.body.name,
//     board: req.params.id,
//     deadline: req.body.deadline,
//     text: req.body.text
//   }) 
//   newChallenge.save(function(error, newChallenge) {
//     if (error)
//       throw error;
//     User.findById(req.user._id, function(error, user) {
//       if (error)
//         throw error;
//       user.suggestedChallenges.push(newChallenge._id)
//       user.save(function(error, updatedUser) {
//         if (error)
//           throw error;
//         Board.findById(newChallenge.board, function(error, board) {
//           if (error)
//             throw error
//           board.challenges.push(newChallenge._id)
//           board.save(function(error, updatedBoard) {
//             if (error)
//               throw error
//             res.redirect('/boards/'+updatedBoard._id)
//           })
//         })
//       })
//     })   
//   })
// })

//Subscribe to board
router.post('/boards/:id/subscribe', function(req, res) {
  var userBoards = Realm.objects('User').filtered(`id="${req.user.id}"`)[0].subscribedBoards
  var userBoardsArr = Object.keys(userBoards).map(function (key) {
    return userBoards[key];
  });  
  var board = Realm.objects('Board').filtered(`id="${req.params.id}"`)[0]
  userBoardsArr.push(board)
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, subscribedBoards: userBoardsArr}, true);
  });
  res.redirect('/')
})

// Unsubscribe to board
router.post('/boards/:id/unsubscribe', function(req, res) {
  var userBoards = Realm.objects('User').filtered(`id="${req.user.id}"`)[0].subscribedBoards 
  var userBoardsIdsArr = Object.keys(userBoards).map(function (key) {
    return userBoards[key].id;
  });
  var index = userBoardsIdsArr.indexOf(req.params.id)
  var userBoardsArr = userBoards.slice(0, index).concat(userBoards.slice(index+1, userBoards.length))
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, subscribedBoards: userBoardsArr}, true);
  });  
  res.redirect('/')
})


module.exports = router;