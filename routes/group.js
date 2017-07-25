var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid')

//Retrieve group page
router.get('/groups/:id', function(req, res) {
  var realmGroup = Realm.objects('Group').filtered(`id="${req.params.id}"`)[0]
  var memberIds = Object.keys(realmGroup.members).map(function (key) {
    return realmGroup.members[key].id;
  });
  if (memberIds.indexOf(req.user.id) > -1) {
  	console.log("here1")
  	res.render('groupProfile', {member: true, id: req.params.id, name: realmGroup.name, admin: realmGroup.admin[0], members: realmGroup.members})
  } else {
  	console.log("here2")
  	res.render('groupProfile', {member: false, id: req.params.id, name: realmGroup.name, admin: realmGroup.admin[0], members: realmGroup.members})
  }
})

//Edit group page
router.post('/groups/:id/edit', function(req, res) {
})

//Join group
router.post('/groups/:id/join', function(req, res) {
	var user = Realm.objects('User').filtered(`id="${req.user.id}"`)[0]
	var group = Realm.objects('Group').filtered(`id="${req.params.id}"`)[0]
	var joinedGroups = Object.keys(user.joinedGroups).map(function (key) {
    return user.joinedGroups[key];
  });
  joinedGroups.push(group)
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, joinedGroups: joinedGroups}, true);
  });
  res.redirect('/groups/'+req.params.id)
})

//Leave group
router.post('/groups/:id/leave', function(req, res) {
	var user = Realm.objects('User').filtered(`id="${req.user.id}"`)[0]
  var realmGroup = Realm.objects('Group').filtered(`id="${req.params.id}"`)[0]
  var joinedGroups = Object.keys(user.joinedGroups).map(function (key) {
    return user.joinedGroups[key];
  });  
  var joinedGroupsIds = Object.keys(user.joinedGroups).map(function (key) {
    return user.joinedGroups[key].id;
  });
  var index = joinedGroupsIds.indexOf(req.params.id) 
  joinedGroups = joinedGroups.slice(0, index).concat(joinedGroups.slice(index+1, joinedGroups.length))
  Realm.write(() => {
    Realm.create('User', {id: req.user.id, joinedGroups: joinedGroups}, true);
  });
  res.redirect('/groups/'+req.params.id)
})

//Hide group
router.post('/groups/:id/hide', function(req, res) {
	var user = Realm.objects('User').filtered(`id="${req.user.id}"`)[0]
	var realmGroup = Realm.objects('Group').filtered(`id="${req.params.id}"`)[0]
	var hiddenGroups = Object.keys(user.hiddenGroups).map(function (key) {
		return user.hiddenGroups[key]
	})
	hiddenGroups.push(realmGroup)
	Realm.write(() => {
		Realm.create('User', {id: req.user.id, hiddenGroups: hiddenGroups}, true);
	})
	res.redirect('back')
})

//Make group public
router.post('/groups/:id/public', function(req, res) {
	var user = Realm.objects('User').filtered(`id="${req.user.id}"`)[0]

	var hiddenGroupsIDs = Object.keys(user.hiddenGroups).map(function (key) {
		return user.hiddenGroups[key].id
	})
	var index = hiddenGroupsIDs.indexOf(req.params.id)
	var hiddenGroups = req.user.hiddenGroups.slice(0, index).concat(req.user.hiddenGroups.slice(index+1, req.user.hiddenGroups.length))
	Realm.write(() => {
		Realm.create('User', {id: req.user.id, hiddenGroups: hiddenGroups}, true)
	})
	res.redirect('back')
})

module.exports = router;