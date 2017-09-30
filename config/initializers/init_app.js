var fs                   = require('fs');
var path                 = require('path');
var mkdirp               = require('mkdirp');
var config               = require('../config.js')();
var eventEmitter         = require('eventemitter3');
var utils                = require('../../app/utils/utils');
var process              = require('process');
var schedule_service     = require('../../app/schedule/schedule_services');

// Helpers
var activity_type_helper = require('../../app/helpers/activity_type_helper');
var message_type_helper  = require('../../app/helpers/message_type_helper');

module.exports = function() {
	if (process.pid) {
		var path_file = path.resolve(".") + '/tmp/pids/server.pid';
		fs.stat(path_file, function(err, stat) {
			if(err === null) {
				fs.writeFile(path_file, process.pid);
	    } else if(err.code == 'ENOENT') {
	        // file does not exist
	        fs.writeFile(path_file, process.pid);
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	  });
	}

	// Create folder videosystem
	// mkdirp("/home/" + process.env.APP_USER + "/videosystem", function (err) {
	//   if (err) {
	//     console.error(err);
	//   }
	// });

	var events = new eventEmitter();

	global.events = events;
	global.HOST_ROOM = config.HOST_ROOM;
	global.status = {
	  online: 0,
	  offline: 1,
	  busy: 2
	};
	global.status_conversation = {
		created: 0,
		living: 1,
		missed: 2,
		ended: 3
	};
	global.notify_type = {
		system: "system",
		call: "call",
		reserve: "reserve",
		chat: "chat"
	};

	// Get activity_type
	activity_type_helper.find_all()
	.then(function(message) {
	  var activity_type = message.data;
	  global.activity_type = {};
	  for(activity in activity_type) {
	    switch(activity_type[activity].action_name) {
	      case "JOIN ROOM":
	        global.activity_type["JOIN ROOM"] = activity_type[activity];
	        break;
	      case "LEFT ROOM":
	        global.activity_type["LEFT ROOM"] = activity_type[activity];
	        break;
	      case "LOGIN":
	        global.activity_type["LOGIN"] = activity_type[activity];
	        break;
	      case "LOGOUT":
	        global.activity_type["LOGOUT"] = activity_type[activity];
	        break;
	      case "DISCONNECT":
	        global.activity_type["DISCONNECT"] = activity_type[activity];
	        break;
	      case "UPLOAD":
	        global.activity_type["UPLOAD"] = activity_type[activity];
	        break;
	      case "RESERVE ROOM":
	        global.activity_type["RESERVE ROOM"] = activity_type[activity];
	        break;
				case "CALL":
					global.activity_type["CALL"] = activity_type[activity];
				case "DENY":
					global.activity_type["DENY"] = activity_type[activity];
	    }
	  }
	}, function(message_error) {
	  utils.log(message_error.error);
	});

	// Get message type
	message_type_helper.find_all()
	.then(function(message) {
	  var data = message.data;
	  global.message_types = {};
	  for(index in data) {
	    switch(data[index].message_type) {
	      case "ROOM":
	        global.message_types["ROOM"] = data[index];
	        break;
	      case "SINGLE":
	        global.message_types["SINGLE"] = data[index];
	        break;
	    }
	  }
	}, function(message_error) {
	  Utils.log(message_error.error);
	});

	// Run schedule worker
	global.schedule_service = new schedule_service();
	global.schedule_service.check_schedule();
};
