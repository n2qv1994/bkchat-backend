/**
 * Author: Nguyen Hoang Anh
 * Services: room_services
 */

var room_helper            = require('../helpers/room_helper');
var user_helper            = require('../helpers/user_helper');
var reservation_helper     = require('../helpers/reservation_helper');
var room_invitation_helper = require('../helpers/room_invitation_helper');
var activity_helper        = require('../helpers/activity_helper');
var transaction_helper     = require('../helpers/transaction_helper');
var notification_helper    = require('../helpers/notification_helper');
var email_service          = require('../mailers/email_service');

var Utils              		 = require('../utils/utils');
var moment             	   = require('moment');
var moment_tz              = require('moment-timezone');
var uuid               		 = require('node-uuid');
var Room                   = require('../wsserver/room');
var session_room           = require('../wsserver/session_room');
var session_user           = require('../wsserver/session_user');

var env                    = process.env.NODE_ENV || 'development';
var config                 = require(__dirname + '/../../config/config.json')[env];

var Room_Services = {

};
var async                  = require('async');

/*
 * function: get_room_starting
 * get to list room
 * params: @callback
 */
Room_Services.get_room_starting = function(callback) {
	room_helper.get_room_with_status(1)
	.then(function(message) {
	  var rooms = message.data;
	  return callback(true, {data: rooms, status: "success", status_code: 200});
	}, function(message_error) {
	  Utils.error_log(message_error.error);
	  return callback(false, {data: message_error.error, status: "error", status_code: 500});
	});
};


/*
 * function: get_reserve_starting
 * get to list reservation
 * params: @user_id, @callback
 */
Room_Services.get_reserve_starting = function(user_id, callback) {
	var reservations = {};

	reservation_helper.get_reserve_by_user(user_id)
	.then(function(message) {
		reservations['current'] = message.data;
		var start = moment().utcOffset("+07:00").startOf('month').valueOf()/1000;
	  var end = moment().utcOffset("+07:00").endOf('month').valueOf()/1000;
		reservation_helper.get_reserve_future(user_id, start, end)
		.then(function(message) {
			reservations['future'] = message.data;
			return callback(true, {data: reservations, status: "success", status_code: 200});
		}, function(message_error) {
			Utils.error_log(message_error.error);
			return callback(false, {data: message_error.error, status: "error", status_code: 500});
		});
	}, function(message_error) {
		Utils.error_log(message_error.error);
		return callback(false, {data: message_error.error, status: "error", status_code: 500});
	});
};


/*
 * function: reserve_room
 * params: @request
 */
Room_Services.reserve_room = function(request, user, schedule_service, callback) {

	// check room exist
	room_helper.find_room_by_name(request.room_name)
	.then(function(message) {
		if(message.data !== null) {
			return callback(false, "room's existed");
		}
		else {
			var reservation = {
				made_at: request.started_at,
				description: request.description,
				status: 0,
				user_id: user.id
			};

			reservation_helper.create(reservation)
			.then(function(message) {
				var reserve = message.data;
				var new_room_code = uuid.v1();
				var new_room = {
					room_code: new_room_code,
					room_name: request.room_name,
					description: request.description,
					limited: request.limited,
					// started_at: request.started_at,
					//started_at: "0000-00-00 00:00:00",
					//ended_at: "0000-00-00 00:00:00",
					enabled: 0,
					status: 0,
					reverse_id: reserve.id

				};
				console.log(request.started_at);
				room_helper.create(new_room)
				.then(function(message) {
					var room_data = message;
					// Insert invitation
					var user_codes = [];
					for(var i = 0; i < request.user_invited.length; i++) {
						user_codes.push(request.user_invited[i].user_code);
					}

					user_helper.find_list_user(user_codes)
					.then(function(message) {
						if(message.data === null) {
							return callback(false, "Not found list user");
						}
						var invitation = [];
						for(var i = 0; i < message.data.length; i++) {
							invitation.push({user_id: message.data[i].id, room_id: room_data.data.id});
							// Insert Notification
							var notify = {
								notice_code: uuid.v1(),
						    notice_by: user.id,
						    name: user.user_name,
						    notice_image: user.image,
						    notice_room: new_room_code,
						    notice_type: "room",
						    notice_body: user.user_name + " has created a meeting",
						    send_at: moment_tz.tz(config.zone).utc().toDate().toString(),
						    readed: 0,
						    user_id: message.data[i].id
							};

							notification_helper.create(notify)
							.then(function(message) {
								Utils.message_log("Insert Notify successfully");
							}, function(message_error) {
								Utils.error_log(message_error.error);
							});
						}

						// Add the worker scheduler
						var schedule = {
							user: user,
							room_name: request.room_name,
							room_code: new_room_code,
							reverse_id: reserve.id,
							started_at: request.started_at,
							invitation: invitation
						};

						schedule_service.set_schedule(schedule);

						room_invitation_helper.bulk_create(invitation)
						.then(function(message) {
							var room = new Room("Mutil", "", new_room_code, request.limited);
							session_room.add_room(room);
						}, function(message_error) {
							Utils.error_log(message_error.error);
							return callback(false, message_error.error);
						});
					}, function(message_error) {
						Utils.error_log(message_error.error);
						return callback(false, message_error.error);
					});
				}, function(message_error) {
					Utils.error_log(message_error.error);
					return callback(false, message_error.error);
				});

				// Insert action
				var action = {
					user_id: user.id,
					action_id: global.activity_type["RESERVE ROOM"].id,
					reverse_id: reserve.id
				};

				activity_helper.create(action)
				.then(function(message) {
					Utils.message_log(message.data);
				}, function(message_error) {
					Utils.error_log(message_error.error);
				});

				// Send mail
				var mail_data = request;
				mail_data.room_master = user;
				// send_mail_invite(mail_data);

				return callback(true, {'message':'reserve room successfully', 'room_code': new_room_code});
			}, function(message_error) {
				Utils.error_log(message_error.error);
				return callback(false, message_error.error);
			});
		}
	}, function(message_error) {
		Utils.error_log(message_error.error);
		return callback(false, message_error.error);
	});
};

/*
 * function: create_room
 * params: @request
 */
Room_Services.create_room = function(user_ids, user, callback) {
	var new_room_code = uuid.v1();
	var new_room = {
		room_code: new_room_code,
		room_name: "Room_" + new_room_code,
		started_at: moment_tz.tz(config.zone).utc().toDate().toString(),
		enabled: 1,
		status: 1
	};
	room_helper.create_1(new_room)
	.then(function(message) {
		var room_data = message;
		var invitation = [];

		// Add user current to user_ids
		user_ids.push(user.id);

		for(var i = 0; i < user_ids.length; i++) {
			invitation.push({user_id: user_ids[i], room_id: room_data.data.id});
			if(user.id !== user_ids[i]) {
				// Insert Notification
				var notify = {
					notice_code: uuid.v1(),
					notice_by: user.id,
					name: user.user_name,
					notice_image: user.image,
					notice_room: new_room_code,
					notice_type: "room",
					notice_body: user.user_name + " has created a meeting",
					send_at: moment_tz.tz(config.zone).utc().toDate().toString(),
					readed: 0,
					user_id: user_ids[i]
				};

				notification_helper.create(notify)
				.then(function(message) {
					Utils.message_log("Insert Notify successfully");
				}, function(message_error) {
					Utils.error_log(message_error.error);
				});
			}
		}

		room_invitation_helper.bulk_create(invitation)
		.then(function(message) {
			var room = new Room("Mutil", "", new_room_code, 20);
			session_room.add_room(room);
		}, function(message_error) {
			Utils.error_log(message_error.error);
			return callback(false, message_error.error);
		});
		
		return callback(true, {'message':'reserve room successfully', 'room_code': new_room_code});
	}, function(message_error) {
		Utils.error_log(message_error.error);
		return callback(false, message_error.error);
	});

	// Insert action
	//var action = {
	// 	user_id: user.id,
	//	action_id: global.activity_type["RESERVE ROOM"].id,
	//	reverse_id: reserve.id
	//};

	//activity_helper.create(action)
	//.then(function(message) {
	//	Utils.message_log(message.data);
	//}, function(message_error) {
	//	Utils.error_log(message_error.error);
	//});

	// Send mail
	var mail_data = request;
	mail_data.room_master = user;
	// send_mail_invite(mail_data);

	// return callback(true, {'message':'reserve room successfully', 'room_code': new_room_code});
};

/*
 * function: join_room
 * params: @wsocket
 */
Room_Services.join_room = function(socket) {
	// Check time room
	room_helper.find_room_valid(socket.unicast.room_code)
	.then(function(message) {
		var rooms = message.data;
		if(rooms.length === 0) {
			socket.unicast.emit("join_room", JSON.stringify({"status": false, "data": "Join a room failure"}));
			return;
		}
		else {
			var room = session_room.get_room(socket.unicast.room_code);
			if(room === undefined) {
				Utils.error_log("Room - " + socket.unicast.room_code + " don't exist.");
				socket.unicast.emit("join_room", JSON.stringify({"status": false, "data": "Join a room failure because room don't exist"}));
				return;
			}
			else if(room.users.length >= room.limited) {
				Utils.error_log("Room - " + socket.unicast.room_code + " is limited.");
				socket.unicast.emit("join_room", JSON.stringify({"status": false, "data": "Join a room failure because room limited"}));
				return;
			}

			socket.unicast.current_room = rooms[0];
			socket.unicast.emit("join_room", JSON.stringify({"status": true, "data": "Join a room successfully"}));

			// Send message to other user
			if(room.users.length > 0) {
				for(var i = 0; i < room.users.length; i++) {
					var user = room.users[i];
					if(user.socket_id === socket.unicast.id) {
						continue;
					}
					else {
						var new_message = {
							user: socket.unicast.current_user
						};
						socket.unicast.to(user.socket_id).emit("user_join_room", JSON.stringify({"status": true,"data": new_message}));
					}
				}
			}

			room.users.push(socket.unicast.current_user);
			session_room.add_user(socket.unicast.room_code, room);
			// Change status of user when user joins room
			session_user.change_status(socket.unicast.user_name, global.status.busy);
			var list_user = session_user.get_users();

			var user_info = {
				id: socket.unicast.current_user.id,
				status: global.status.busy
			};

			// Update status in database store
			user_helper.update_status(user_info)
			.then(function(message) {
				Utils.message_log(socket.unicast.user_name + " change status " + message.data);
				socket.broadcast.emit("status_other_user", JSON.stringify({
					"status": true,
					"data": {
						"status": "busy",
						"user": socket.unicast.current_user.user_name
					}
				}));
			}, function(message_error) {
				Utils.error_log(message_error.error);
			});

			// Add transaction
			room_helper.find_room_by_code(socket.unicast.room_code)
			.then(function(message) {
				var room = message.data;
				if(room !== null) {
					var transaction = {
						transaction_code: uuid.v1(),
						user_id: socket.unicast.current_user.id,
						room_id: room.id,
						action_id: global.activity_type["JOIN ROOM"].id
					};
					transaction_helper.create(transaction)
					.then(function(message) {
						Utils.message_log(message.data);
					}, function(message_error) {
						Utils.error_log(message_error.error);
					});

					// insert action
					var action = {
						user_id: socket.unicast.current_user.id,
						action_id: global.activity_type["JOIN ROOM"].id,
						reverse_id: room.reverse_id
					};
					activity_helper.create(action)
					.then(function(message) {
						Utils.message_log(message.data);
					}, function(message_error) {
						Utils.error_log(message_error.error);
					});
				}
			}, function(message_error) {
				Utils.error_log(message_error.error);
			});
		}
	}, function(message_error) {
		Utils.error_log(message_error.error);
	});
};


/*
 * function: left_room
 * params: @wsocket
 */
Room_Services.left_room = function(socket) {
	var room = session_room.get_room(socket.unicast.room_code);
	if(room === undefined) {
		Utils.error_log("Not found room in System");
		return;
	}
	// Send message to other user
	for(var i = 0; i < room.users.length; i++) {
		var user = room.users[i];
		if(user.socket_id === socket.unicast.id) {
			continue;
		}
		var new_message = {
			user: socket.unicast.current_user
		};
		socket.unicast.to(user.socket_id).emit("user_left_room", JSON.stringify({
			"status": true,
			"data": new_message
		}));
	}

	// Change status
	session_user.change_status(socket.unicast.user_name, global.status.online);
	var list_user = session_user.get_users();
	var user_info = {
		id: socket.unicast.current_user.id,
		status: global.status.online
	};

	// Update status in database store
	user_helper.update_status(user_info)
	.then(function(message) {
		Utils.message_log(socket.unicast.user_name + " change status " + message.data);
		web_socket.emit("status_other_user", JSON.stringify({
			"status": true,
			"data": {
				"status": "online",
				"user": socket.unicast.current_user.user_name
			}
		}));
	}, function(message_error) {
		Utils.error_log(message_error.error);
	});
	// Add transaction
	room_helper.find_room_by_code(socket.unicast.room_code)
	.then(function(message) {
		var room = message.data;
		if(room !== null) {
			var transaction = {
				transaction_code: uuid.v1(),
				user_id: socket.unicast.current_user.id,
				room_id: room.id,
				action_id: global.activity_type["LEFT ROOM"].id
			};
			transaction_helper.create(transaction)
			.then(function(message) {
				Utils.message_log(message.data);
			}, function(message_error) {
				Utils.error_log(message_error.error);
			});

			// insert action
			var action = {
				user_id: socket.unicast.current_user.id,
				action_id: global.activity_type["LEFT ROOM"].id,
				reverse_id: room.reverse_id
			};
			activity_helper.create(action)
			.then(function(message) {
				Utils.message_log(message.data);
			}, function(message_error) {
				Utils.error_log(message_error.error);
			});

			socket.unicast.room_code = null;
			session_room.leave_room(room.room_code, socket.unicast.user_name);
			socket.unicast.current_room = {};
		}
	}, function(message_error) {
		Utils.error_log(message_error.error);
	});
};

Room_Services.ask_room = function(user, room_code, callback) {

	room_helper.find_room_by_code(room_code)
	.then(function(room) {
		if( room.data == null) {
			return callback(true, {data: "Room invalid", status: "error", status_code: 404});
		}
		var _room = {
			room_id : room.data.id,
			reverse_id: room.data.reverse_id
		}
		return _room;
	})
	.then(function(_room) {
		user_helper.find_by_name(user.user_name)
		.then(function(user) {
			room_invitation_helper.check_invitation(user.data.id, _room.room_id)
			.then(function(result) {
				if(result == "") {
					return callback(true, {data: "access not allowed ", status: "error", status_code: 500});
				}
				var action = {
					user_id: result.user_id,
					action_id: global.activity_type["JOIN ROOM"].id,
					reverse_id: _room.reverse_id
				};
				activity_helper.create(action)
				.then(function(message) {
					Utils.message_log(message.data);
				}, function(message_error) {
					Utils.error_log(message_error.error);
				});
				return callback(false, {data: result, status: true, status_code: 200});
			})
			.catch(function(err) {
				return callback(true, {data: err, status: "error", status_code: 500});
			})
		})
		.catch(function(err) {
			return callback(true, {data: err, status: "error", status_code: 500});
		});
	})
	.catch(function(err) {
		return callback(true, {data: err, status: "error", status_code: 500});
	});
};

function send_mail_invite(room) {
  var url = GLOBAL.HOST_ROOM + room.room_name;
  var users = room.user_invited;
  async.each(users, function(user, callback) {
    email_service.send_invite(room, user, url, function(error, result) {
      Utils.message_log("Status of the send mail to " + user.user_name + ": " + result);
      callback();
    });
  }, function(error) {
    if(error !== '') {
      Utils.error_log(error);
    }
  });
};



module.exports = Room_Services;
