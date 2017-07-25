var Realm = require('realm')

let UserSchema = {
	name : 'User',
	primaryKey: 'id',
	properties : {
		id: 'string',
		admin: {type: 'bool', default: false},
		username: 'string',
		password: 'string',
		firstName: 'string',
		lastName: 'string',
		adminGroups: {type: 'list', objectType: 'Group', default: []},
		joinedGroups: {type: 'list', objectType: 'Group', default: []},
		hiddenGroups: {type: 'list', objectType: 'Group', default: []},
		subscribedBoards: {type: 'list', objectType: 'Board', default: []},
		posts: {type: 'list', objectType: 'Post', default: []},
		createdEvents: {type: 'list', objectType: 'Event', default: []},
		attendedEvents: {type: 'list', objectType: 'Event', default: []},
		acceptedChallenges: {type: 'list', objectType: 'Challenge', default: []},
		hiddenChallenges: {type: 'list', objectType: 'Challenge', default: []},
		comments: {type: 'list', objectType: 'Comment', default: []}		
	}
};

let GroupSchema = {
	name: 'Group',
	primaryKey: 'id',
	properties: {
		id: 'string',
		name: 'string',
		admin: {type: 'linkingObjects', objectType: 'User', property: 'adminGroups'},
		members: {type: 'linkingObjects', objectType: 'User', property: 'joinedGroups'},
		posts: {type: 'list', objectType: 'Post', default: []},
		createdEvents: {type: 'list', objectType: 'Event', default: []},
		attendedEvents: {type: 'list', objectType: 'Event', default: []},
		acceptedChallenges: {type: 'list', objectType: 'Challenge', default: []},
		hiddenChallenges: {type: 'list', objectType: 'Challenge', default: []},
		comments: {type: 'list', objectType: 'Comment', default: []}
	}
}

let BoardSchema = {
	name: 'Board',
	primaryKey: 'id',
	properties: {
		id: 'string',
		name: 'string',
		description: 'string',
		subscribers: {type: 'linkingObjects', objectType: 'User', property: 'subscribedBoards'},
		posts: {type: 'list', objectType: 'Post', default: []},
		events: {type: 'list', objectType: 'Event', default: []},
		challenges: {type: 'list', objectType: 'Challenge', default: []}
	}
}

let PostSchema = {
	name: 'Post',
	primaryKey: 'id',
	properties: {
		id: 'string',
		postedBy: {type: 'linkingObjects', objectType: 'User', property: 'posts'},
		postingGroup: {type: 'linkingObjects', objectType: 'Group', property: 'posts'},
		board: {type: 'linkingObjects', objectType: 'Board', property: 'posts'},
		createdAt: {type: 'date', default: new Date()},		
		title: 'string',
		content: 'string',
		comments: {type: 'list', objectType: 'Comment', default: []}
	}
}

let CommentSchema = {
	name: 'Comment',
	primaryKey: 'id',
	properties: {
		id: 'string',
		postedBy: {type: 'linkingObjects', objectType: 'User', property: 'comments'},
		postingGroup: {type: 'linkingObjects', objectType: 'Group', property: 'comments'},
		createdAt: {type: 'date', default: new Date()},
		text: 'string',
		comments: {type: 'list', objectType: 'Comment', default: []}
	}
}

let EventSchema = {
	name: 'Event',
	primaryKey: 'id',
	properties: {
		id: 'string',
		postedBy: {type: 'linkingObjects', objectType: 'User', property: 'createdEvents'},
		postingGroup: {type: 'linkingObjects', objectType: 'Group', property: 'createdEvents'},
		board: {type: 'linkingObjects', objectType: 'Board', property: 'events'},
		createdAt: {type: 'date', default: new Date()},
		title: 'string',
		startTime: 'date',
		endTime: 'date',
		location: 'string',
		description: 'string',
		comments: {type: 'list', objectType: 'Comment', default: []},
		attendees: {type: 'linkingObjects', objectType: 'User', property: 'attendedEvents', default: []}
	}
}

let ChallengeSchema = {
	name: 'Challenge',
	primaryKey: 'id',
	properties: {
		id: 'string',
		postedBy: {type: 'User'},
		postingGroup: {type: 'Group'},
		board: {type: 'linkingObjects', objectType: 'Board', property: 'challenges'},
		createdAt: {type: 'date', default: new Date()},
		title: 'string',
		startTime: 'date',
		endTime: 'date',
		location: 'string',
		description: 'string',
		comments: {type: 'list', objectType: 'Comment', default: []},
		acceptingUsers: {type: 'linkingObjects', objectType: 'User', property: 'acceptedChallenges', default: []},
		acceptingGroups: {type: 'linkingObjects', objectType: 'Group', property: 'acceptedChallenges', default: []}
	}
}

var realm = new Realm({schema: [UserSchema, GroupSchema, BoardSchema, PostSchema, EventSchema, ChallengeSchema, CommentSchema]})

module.exports = realm;