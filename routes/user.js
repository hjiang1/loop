var express = require('express');
var router = express.Router();
var Realm = require('../models/realm')
var shortid = require('shortid')


//Retrieve User Page
router.get('/users/:id', function(req, res) {
	if (req.user.id === req.params.id) {
    var hiddenGroupsIDs = Object.keys(req.user.hiddenGroups).map(function (key) {
      return req.user.hiddenGroups[key].id;
    });
    var groups = []
    for (var i=0; i<req.user.joinedGroups.length; i++) {
    	if (hiddenGroupsIDs.indexOf(req.user.joinedGroups[i].id) > -1) {
    		groups.push({"public": false, "group": {
    			"id": req.user.joinedGroups[i].id,
    			"name": req.user.joinedGroups[i].name
    		}})
    	} else {
    		groups.push({"public": true, "group": {
    			"id": req.user.joinedGroups[i].id,
    			"name": req.user.joinedGroups[i].name
    		}})
    	}
    }
    console.log("groups", groups)
		res.render('profile', {self: true, firstName: req.user.firstName, lastName: req.user.lastName, username: req.user.username, groups: groups})
	} else {
		//else view
		var user = Realm.objects('User').filtered(`id="${req.params.id}"`)[0]
		var publicGroups = []
		console.log("userhiddenGroups", user.hiddenGroups)
		var hiddenGroupsIds = Object.keys(user.hiddenGroups).map( function(key) {
			return user.hiddenGroups[key].id;
		})
		for (var i=0; i<user.joinedGroups.length; i++) {
			if (hiddenGroupsIds.indexOf(user.joinedGroups[i].id) === -1) {
				publicGroups.push(user.joinedGroups[i])
			}
		}
		res.render('profile', {self: false, firstName: user.firstName, lastName: user.lastName, username: user.username, publicGroups: publicGroups})
	}
})

//update user page
router.post('/users/:id/edit', function(req, res) {
})

module.exports = router;