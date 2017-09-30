/* WS Server */

var web_socket             = global.socket_system;
var Room                   = require('./room');
var session_room           = require('./session_room');
var session_user           = require('./session_user');

// Services
var room_services          = require('../services/room_services');
var user_services          = require('../services/user_services');
var activity_services      = require('../services/activity_services');
var meeting_services      = require('../services/meeting_services');
var email_services         = require('../mailers/email_service.js');
// var SCHEDULE_SERVICES      = require('../schedule/schedule_services');
var notification_services  = require('../services/notification_services');
var chat_service           = require('../chat/chat_service');

// Helpers
var room_helper            = require('../helpers/room_helper');
var user_helper            = require('../helpers/user_helper');
var activity_helper        = require('../helpers/activity_helper');
var room_invitation_helper = require('../helpers/room_invitation_helper');
var transaction_helper     = require('../helpers/transaction_helper');
var reservation_helper     = require('../helpers/reservation_helper');
var messages_helper        = require('../helpers/messages_helper');
var notification_helper    = require('../helpers/notification_helper');

var Base64                 = require('../utils/base64');
var uuid                   = require('node-uuid');
var Utils                  = require('../utils/utils');
var async                  = require('async');
var moment                 = require('moment-timezone');
var env                    = process.env.NODE_ENV || 'development';
var config                 = require(__dirname + '/../../config/config.json')[env];
// Get Room with status live
room_services.get_room_starting(function(error, message) {
  if(!error) {
    Utils.error_log(message.data);
  }
  else {
    var rooms = message.data;

    for(var i = 0; i < rooms.length; i++) {
      var data = rooms[i];
      var room = new Room("Mutil", "", data.room_code, data.limited);
      session_room.add_room(room);
    }
  }
});


// // Run schedule worker
// var schedule_service = new SCHEDULE_SERVICES();
// schedule_service.check_schedule();

// Get user in system
user_services.get_users(function(error, message) {
  if(!error) {
    Utils.error_log(message.data);
  }
  else {
    var users = message.data;
    global.events.emit('starting', users);
  }
});


// Event get list users
global.events.on('starting', function(users) {
  var list_user = [];
  for(var i = 0; i < users.length; i++) {
    var user = {
      id: users[i].id,
      user_code: user[i].user_code,
      first_name: users[i].first_name,
      last_name: users[i].last_name,
      email: users[i].email,
      image: users[i].image,
      address: users[i].address,
      phone: users[i].phone,
      user_name: users[i].user_name,
      enabled: users[i].enabled,
      status: users[i].status,
      role_id: users[i].role_id,
      created_at: users[i].created_at,
      updated_at: users[i].updated_at,
      socket_id: ""
    };

    list_user.push(user);
  }

  session_user.update_list_user(list_user);
});

// Update when schedule's running
// global.events.on('schedule', function(schedule) {
//   var room_code = schedule.room_code;
//   var list_socket = web_socket.clients().sockets;
//   for(var socket in list_socket) {
//     console.log(web_socket.sockets[socket].user_name);
//   };
// });

// Socket
web_socket.on('connection', function(wsocket) {
  wsocket.room_code = null;
  wsocket.user_name = wsocket.handshake.query.username;
  wsocket.current_user = {};
  wsocket.current_room = {};

  Utils.message_log(wsocket.user_name + " with socket_id: " + wsocket.id + " connected to wsserver");
  var list_user = session_user.get_users();
  user_helper.find_all()
  .then(function(message) {
    var new_list_user = message.data;
    if(new_list_user.length > list_user.length) {
      var tmp_list_user = list_user;
      for(var i = 0; i < new_list_user.length; i++) {
        var check = false;
        for(var j = 0 ; j < tmp_list_user.length; j++) {
          if(new_list_user[i].user_name == tmp_list_user[j].user_name) {
            check = true;
            break;
          }
        }
        if(!check) {
          new_list_user[i].socket_id = "";
          tmp_list_user.push(new_list_user[i]);
        }
      }
      list_user = tmp_list_user;
    }
    else if(new_list_user.length < list_user.length) {
      var tmp_list_user = list_user;
      for(var i = 0; i < tmp_list_user.length; i++) {
        var check = false;
        for(var j = 0; j < new_list_user.length; j++) {
          if(tmp_list_user[i].user_name === new_list_user[j].user_name) {
            check = true;
            break;
          }
        }
        if(!check) {
          tmp_list_user.splice(i, 1);
        }
      }
      list_user = tmp_list_user;
    }

    session_user.update_list_user(list_user);
    session_user.edit_user(wsocket.user_name, wsocket.id);

    // Change status
    session_user.change_status(wsocket.user_name, global.status.online);
    // list_user = session_user.get_users();
    user_helper.find_by_name(wsocket.user_name)
    .then(function(message) {
      var user = message.data;

      wsocket.current_user = {
        id: user.id,
        user_code: user.user_code,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image,
        address: user.address,
        phone: user.phone,
        user_name: user.user_name,
        enabled: user.enabled,
        status: user.status,
        role_id: user.role_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        socket_id: wsocket.id
      };

      if(user !== null) {
        var user_info = {
          status: global.status.online,
          id: user.id
        };

        user_helper.update_status(user_info)
        .then(function(message) {
          Utils.message_log(user.user_name + " change status " + message.data);
          wsocket.emit('authenticate', JSON.stringify({"status": true, "data": "success"}));
          web_socket.emit("status_other_user", JSON.stringify({"status": true, "data": { "status": "online", "user": wsocket.current_user.user_name }}));
        }, function(message_error) {
          Utils.error_log(message_error.error);
        });
      }
    }, function(message_error) {
      Utils.error_log(message_error.error);
    });
  }, function(message_error) {
    Utils.error_log(message_error.error);
    wsocket.emit('authenticate', JSON.stringify({"status": false, "data": "error"}));
  });

  wsocket.on('list_user', function(message) {
    var users = session_user.get_users();
    var user_res = [];

    for(var i = 0; i < users.length; i++) {
      if(users[i].user_name === 'admin' || users[i].user_name === wsocket.current_user.user_name) {
        continue;
      }
      else {
        user_res.push(users[i]);
      }
    }
    wsocket.emit("list_user", JSON.stringify({"status": true, "data": user_res}));
  });

  wsocket.on('get_activities', function(message) {
    var data_req = JSON.parse(message);
    var offset = 0;

    if(data_req !== null) {
      offset = data_req.data.offset;
    }

    if(wsocket.current_user.id) {
      activity_services.get_activities(wsocket.current_user.id, offset, function(error, message) {
        wsocket.emit('get_activities', JSON.stringify({"status": true, "data": message}));
      });
    }
  });

  wsocket.on('get_reserve', function(message) {
    if(wsocket.current_user.id) {
      room_services.get_reserve_starting(wsocket.current_user.id, function(error, message) {
        var data = message.data;
        async.parallel([
          function(callback) {
            for(var i = 0; i < data['current'].length; i++) {
              data['current'][i].made_at = Utils.set_format_date(data['current'][i].made_at);
              data['current'][i].started_at = Utils.set_format_date(data['current'][i].started_at);
              data['current'][i].ended_at = Utils.set_format_date(data['current'][i].ended_at);
            }
            callback(null, data['current']);
          },
          function(callback) {
            for(var i = 0; i < data['future'].length; i++) {
              data['future'][i].made_at_iso = data['future'][i].made_at;
              data['future'][i].made_at = Utils.set_format_date(data['future'][i].made_at);
              data['future'][i].started_at_iso = data['future'][i].started_at;
              data['future'][i].started_at = Utils.set_format_date(data['future'][i].started_at);
              data['future'][i].ended_at = Utils.set_format_date(data['future'][i].ended_at);
            }
            callback(null, data['future']);
          }
        ], function(err, result) {
          wsocket.emit('get_reserve', JSON.stringify({"status": true, "data": data}));
        });
      });
    }
  });

  wsocket.on('get_messages', function(message) {

    var room_id = wsocket.current_room.id || '';

    if(room_id === '') {
      return;
    }

    messages_helper.find_all(room_id)
    .then(function(messages) {
      var list_message = messages.data;
      var data = [];
      for(var i = 0; i < list_message.length; i++) {
        var message = {};
        if(wsocket.current_user.user_name === list_message[i].user_send) {
          message.type = true;
        }
        else {
          message.type = false;
        }

        message.from = {"user_name": list_message[i].user_send, "image": list_message[i].image_user_send};
        message.message = list_message[i].content;
        message.time = list_message[i].created_at;
        data.push(message);
      }
      wsocket.emit('get_messages', JSON.stringify({"status": true, "data": data}));
    }, function(message_error) {
      wsocket.emit('get_messages', JSON.stringify({"status": false, "data": message_error.error}));
    });
  });

  wsocket.on('reserve_room', function(message) {
    Utils.message_log(wsocket.current_user.user_name + " reserved a conference");
    try {
      var data_req     = JSON.parse(message).data;
      var request      = {};

      request.room_name    = Base64.encode(data_req.room_name) ||  '';
      request.started_at   = data_req.started_at || '';
      request.user_invited = data_req.user_invited || [];
      request.limited      = data_req.limited || '';
      request.description  = data_req.description || '';

      if(request.room_name === '' || request.started_at === '' || request.user_invited.length === 0 || request.limited === '') {
        wsocket.emit('reserve_room', JSON.stringify({"status": false, "data": "reserve room failure"}));
        return;
      }

      if(request.limited < request.user_invited.length) {
        wsocket.emit('reserve_room', JSON.stringify({"status": false, "data": "reserve room failure"}));
        return;
      }

      room_services.reserve_room(request, wsocket.current_user, schedule_service, function(error, data) {
        if(!error) {
          wsocket.emit('reserve_room', JSON.stringify({"status": false, "data": data}));
        }
        wsocket.emit('reserve_room', JSON.stringify({"status": true, "data": data}));
      });
    } catch(e) {
      Utils.error_log(e);
    }
  });

  wsocket.on('join_room', function(message) {
    Utils.message_log(wsocket.id + " joined a room");
    try {
      var data_req = JSON.parse(message).data;
      var req_room_code = data_req.room_name || '';
      var req_user_name = data_req.user_name || '';

      if(req_room_code === '' || req_user_name === '') {
        return;
      }

      wsocket.room_code = Base64.decode(req_room_code);
      var socket = {
        broadcast: web_socket,
        unicast: wsocket
      };
      room_services.join_room(socket);
    } catch(e) {
      Utils.error_log(e);
    }
  });

  wsocket.on('left_room', function(message) {
    Utils.message_log(wsocket.id + " leave a room.");

    try {
      var data_req = JSON.parse(message).data;

      var room_code = data_req.room_name || '';
      var user_name = data_req.user_name || '';

      if(room_code === '' || user_name === '') {
        Utils.error_log("Request to left_room error");
        return;
      }

      var socket = {
        broadcast: web_socket,
        unicast: wsocket
      };

      room_services.left_room(socket);
    } catch(error) {
      Utils.error_log(error);
    }
  });

  wsocket.on('get_participants', function(message) {
    try {
      var room_code = wsocket.current_room.room_code;
      if(room_code === undefined) {
        wsocket.emit('get_participants', JSON.stringify({"status": false, "data": "get participants failure"}));
        return;
      }

      var room = session_room.get_room(room_code);

      if(room === undefined) {
        return;
      }

      Utils.message_log('GET PARTICIPANTS: - ' + room_code);
      wsocket.emit('get_participants', JSON.stringify({"status": true, "data": room.users}));
    } catch(e) {
      Utils.error_log(e);
    }
  });

  wsocket.on('record', function(data) {
    Utils.message_log(wsocket.id + " is recording the call");
  });

  wsocket.on('chat_room_broadcast', function(message) {
    var data_req = JSON.parse(message).data;

    var name = data_req.from || '';

    if(name === '') {
      return;
    }

    var list_message = [];
    var room = session_room.get_room(wsocket.room_code);
    if(room !== undefined) {
      for(var i = 0; i < room.users.length; i++) {
        list_message.push({
          content: data_req.message,
          sended_by: wsocket.current_user.id,
          recieved_by: room.users[i].id,
          room_id: wsocket.current_room.id,
          message_type: global.message_types["ROOM"].id
        });
      }

      messages_helper.bulk_create(list_message)
      .then(function(message) {
        Utils.message_log(message.data);
      }, function(message_error) {
        Utils.error_log(message_error.error);
      });

      session_room.send_message_broadcast(wsocket.room_code, data_req, wsocket);
    }
  });


  wsocket.on('chat_room_direct', function(message) {
    var data_req = JSON.parse(message).data;

    if (data_req.from === "" || data_req.from === null || data_req.from === undefined || data_req.to === "" || data_req.to === null || data_req.to === undefined) {
        return;
    }
    var user_receive = session_user.find_user(data_req.to.user_name);

    if (user_receive === null ) {
        return;
    };
    wsocket.to(user_receive.socket_id).emit("chat_room_direct", JSON.stringify({"data": data_req}));
  });

  wsocket.on('chat_room', function(message) {
    var data_req = JSON.parse(message).data;

    var name = data_req.from || '';

  });

  wsocket.on('chat_user', function(message) {
    var data_req = JSON.parse(message).data;

    var from = data_req.from || '';
    var to = data_req.to || '';

    if(from === '' || to === '') {
      return;
    }

    session_room.send_message(message, wsocket);
  });

  wsocket.on('logout', function(data) {
    Utils.message_log(wsocket.current_user.user_name + " logout server");
    // Change status
    session_user.change_status(wsocket.current_user.user_name, global.status.offline);

    wsocket.room_code = null;

    var user_info = {
      id: wsocket.current_user.id,
      status: global.status.offline
    };
    // Update status in database store
    user_helper.update_status(user_info)
    .then(function(message) {
      Utils.message_log(wsocket.user_name + " change status " + message.data);
    }, function(message_error) {
      Utils.error_log(message_error.error);
    });

    // Insert action
    var action = {
      user_id: wsocket.current_user.id,
      action_id: global.activity_type["LOGOUT"].id
    };
    activity_helper.create(action)
    .then(function(message) {
      Utils.message_log(message.data);
    }, function(message_error) {
      Utils.error_log(message_error.error);
    });

  });

  wsocket.on('disconnect', function(data) {
    // Change status
    session_user.change_status(wsocket.current_user.user_name, global.status.offline);
    var list_user = session_user.get_users();

    web_socket.emit("status_other_user", JSON.stringify({"status": true, "data": { "status": "offline", "user": wsocket.current_user.user_name }}));

    var user_info = {
      id: wsocket.current_user.id,
      status: global.status.offline
    };
    // Update status in database store
    user_helper.update_status(user_info)
    .then(function(message) {
      Utils.message_log(wsocket.user_name + " change status " + message.data);
    }, function(message_error) {
      Utils.error_log(message_error.error);
    });

    // Insert action
    var action = {
      user_id: wsocket.current_user.id,
      action_id: global.activity_type["DISCONNECT"].id
    };
    activity_helper.create(action)
    .then(function(message) {
      Utils.message_log(message.data);
    }, function(message_error) {
      Utils.error_log(message_error.error);
    });

    if(wsocket.room_code !== null) {
      var room = session_room.get_room(wsocket.room_code);
      if(room === undefined) {
        return;
      }

      // Send message to other user
      for(var i = 0; i < room.users.length; i++) {
        var user = room.users[i];
        if(user.socket_id == wsocket.id) {
          continue;
        }
        var new_message = {
          user: wsocket.current_user
        };
        wsocket.to(user.socket_id).emit("user_leave_room", JSON.stringify({"status": true, "data": new_message}));
      }

      session_room.leave_room(wsocket.room_code, wsocket.user_name);
      wsocket.room_code = null;
      wsocket.current_user = {};
      wsocket.current_room = {};
    }
  });

  wsocket.on('caller', function(message) {
    try{
      var data_req = JSON.parse(message).data;
      var user = SessionUser.findUser(data_req.from);
      if(user !== null) {
        var data = {
          from: user,
          to: data_req.to
        };

        wsocket.to(data_req.to.socketId).emit("caller", JSON.stringify({"data": data}));
      }
      else {
        wsocket.emit("call_error", "error");
      }
    } catch(e) {
      console.log(e);
    }
  });

  wsocket.on('callee', function(message) {
    try {
      var data_req = JSON.parse(message).data;
      if(data_req.status) {
        var roomName = uuid.v4();
        var new_room = {
          roomName: roomName,
          roomMaster: data_req.from.username,
          description: "",
          limit: 2,
          lock: "false",
          create_at: new Date(),
          status: "live"
        };

        roomModel.createRoom(new_room, function(err, result) {
          if(err) {
            console.log(result);
            web_socket.emit('callee', JSON.stringify({"data": {status: false}}));
            return;
          }

          var room = new Room(roomName, new_room.limit);
          session_room.add_room(room);

          web_socket.to(data_req.from.socketId).emit("callee", JSON.stringify({"data": {roomname: room.roomName, status: true}}));
          web_socket.to(data_req.to.socketId).emit("callee", JSON.stringify({"data": {roomname: room.roomName, status: true}}));
        });
      }
      else {
        web_socket.to(data_req.from.socketId).emit("callee", JSON.stringify({"data": {status: false}}));
      }
    } catch(e) {
      console.log(e);
    }
  });

  wsocket.on('chat_with_single_user', function(message) {
    var data_req = JSON.parse(message).data;

    if (data_req.from.user_name === "" || data_req.from.user_name === null || data_req.from.user_name === undefined || data_req.to === "" || data_req.to === null || data_req.to === undefined) {
      return;
    }

    chat_service.chat_single(data_req, wsocket);
  });

  wsocket.on("call_with_friend", function(message) {
    var data_req = JSON.parse(message).data;
    if (data_req.from.user_name === "" || data_req.from.user_name === null || data_req.from.user_name === undefined || data_req.to === "" || data_req.to === null || data_req.to === undefined) {
      return;
    }
    var user = session_user.find_user(data_req.to);
    wsocket.to(user.socket_id).emit('call_with_friend', JSON.stringify({ "data": data_req }));
  });

  wsocket.on('check_readed',function(message) {
    var data_req = JSON.parse(message).data;

    if (data_req.user_send === "" || data_req.user_send === null || data_req.user_send === undefined) {
      return;
    };

    var data = {
      time_readed : moment().tz('Asia/Ho_Chi_Minh').format('HH:mm a DD/MM')
    };
    var user = session_user.find_user(data_req.user_send);

    wsocket.to(user.socket_id).emit('check_readed', JSON.stringify({"data": data}));
  });

  wsocket.on('call', function(message) {
    var data_req = JSON.parse(message).data;
    if (data_req.from.user_name === "" || data_req.from.user_name === null || data_req.from.user_name === undefined || data_req.to === "" || data_req.to === null || data_req.to === undefined) {
      return;
    }
    var user_recv = session_user.find_user(data_req.to);
    var user_send = session_user.find_user(data_req.from.user_name);
    user_send.count = 0;
    user_recv.count = 0;
    var room_code = uuid.v1()
    if(data_req.status === "accept") {
      var room = new Room("Single", user_recv.user_name, room_code, 2);
      room.users.push(user_recv);
      room.users.push(user_send);
      session_room.add_room(room);
      data_req.room_code = room_code;
    }
    else if(data_req.status === "cancel") {
      // Insert Notification
      var notify = {
        notice_code: uuid.v1(),
        notice_by: user_send.id,
        name: user_send.user_name,
        notice_image: user_send.image,
        notice_room: "",
        notice_type: "miss call",
        notice_body: "Missed call from " + user_send.user_name,
        send_at: moment.tz(config.zone).utc().toDate().toString(),
        readed: 0,
        user_id: user_recv.id
      };

      notification_helper.create(notify)
      .then(function(message) {
        Utils.message_log("Insert Notify successfully");
      }, function(message_error) {
        Utils.error_log(message_error.error);
      });
    }

    wsocket.emit('call', JSON.stringify({"data": data_req}));
    wsocket.to(user_recv.socket_id).emit('call', JSON.stringify({"data": data_req}));
  });

  /*
    data: {
      host: true/false,
      status: true/false,
      call: {
        from: name,
        to: name
      }
    }
  */
  wsocket.on('check_direct_call', function(message) {
    var data_req = JSON.parse(message);
    var data_res = {
      host: false,
      status: false,
      call: {
        from: "",
        to: ""
      }
    };
    var user = session_user.find_user(data_req.user_name);
    if(user !== null) {
      var list_room = session_room.list_room;
      for(var key in list_room) {
        var room = list_room[key];
        if(room.type === "Single") {
          for(var i = 0; i < room.users.length; i++) {
            if(room.users[i].user_name === user.user_name) {
              if(room.users[i].count === 0) {
                room.users[i].count++;
              }
              if((room.users[0].count+room.users[1].count) == 2) {
                var user_0 = session_user.find_user(room.users[0].user_name);
                var user_1 = session_user.find_user(room.users[1].user_name);
                data_res.status = true;
                data_res.call.from = room.users[i].user_name;
                if(room.host === room.users[i].user_name) {
                  data_res.host = true;
                  if(i === 0) {
                    data_res.call.to = room.users[1].user_name;
                    wsocket.emit('check_direct_call', JSON.stringify(data_res));
                    data_res.host = false;
                    data_res.call.from = room.users[1].user_name;
                    data_res.call.to = room.users[i].user_name;
                    wsocket.to(user_1.socket_id).emit('check_direct_call', JSON.stringify(data_res));
                    session_room.remove_room(room.room_code);
                    return;
                  }
                  if(i === 1) {
                    data_res.call.to = room.users[0].user_name;
                    wsocket.emit('check_direct_call', JSON.stringify(data_res));
                    data_res.host = false;
                    data_res.call.from = room.users[0].user_name;
                    data_res.call.to = room.users[i].user_name;
                    wsocket.to(user_0.socket_id).emit('check_direct_call', JSON.stringify(data_res));
                    session_room.remove_room(room.room_code);
                    return;
                  }
                }
                else {
                  data_res.host = false;
                  if(i === 0) {
                    data_res.call.to = room.users[1].user_name;
                    wsocket.emit('check_direct_call', JSON.stringify(data_res));
                    data_res.host = true;
                    data_res.call.from = room.users[1].user_name;
                    data_res.call.to = room.users[i].user_name;
                    wsocket.to(user_1.socket_id).emit('check_direct_call', JSON.stringify(data_res));
                    session_room.remove_room(room.room_code);
                    return;
                  }
                  if(i === 1) {
                    data_res.call.to = room.users[0].user_name;
                    wsocket.emit('check_direct_call', JSON.stringify(data_res));
                    data_res.host = true;
                    data_res.call.from = room.users[0].user_name;
                    data_res.call.to = room.users[i].user_name;
                    wsocket.to(user_0.socket_id).emit('check_direct_call', JSON.stringify(data_res));
                    session_room.remove_room(room.room_code);
                    return;
                  }
                }
                wsocket.emit('check_direct_call', JSON.stringify(data_res));
                return;
              }
            }
          }
        }
      }
      wsocket.emit('check_direct_call', JSON.stringify(data_res));
      return;
    }
    wsocket.emit('check_direct_call', JSON.stringify(data_res));
    return;
  });

  wsocket.on('chat_room_p2p', function(message) {
    var data_req = JSON.parse(message).data;
    if (data_req.from.user_name === "" || data_req.from.user_name === null || data_req.from.user_name === undefined || data_req.to === "" || data_req.to === null || data_req.to === undefined) {
      return;
    }
    var user = session_user.find_user(data_req.to);
    wsocket.to(user.socket_id).emit('chat_room_p2p', JSON.stringify({"data": data_req}));
  });

  wsocket.on("get_user_invite", function(message) {
    var data_req = JSON.parse(message).data;
    var room_code = Base64.decode(data_req);
    meeting_services.get_room(room_code, function(err, result) {
      if(err) {
        var user_invited = result.data.users;
        wsocket.emit("get_user_invite", JSON.stringify({"data": user_invited}))
      }
    });
  });

  wsocket.on("invite_to_room", function(message) {
    var data_req = JSON.parse(message).data;
    var user = session_user.find_user(data_req.to);
    wsocket.to(user.socket_id).emit('invite_to_room', JSON.stringify({"data": data_req}));
  });

  wsocket.on("get_messages_single", function(message) {
    var data_req = JSON.parse(message).data;
    var user_send = session_user.find_user(data_req.from);
    var user_receive = session_user.find_user(data_req.to);
    messages_helper.get_messages_single(user_send.id, user_receive.id)
    .then(function(message) {
      var data = message.data;
      var _data = [];
      for(var i = 0; i < data.length; i++) {
        var _message = {};
        _message.content = data[i].content;
        _message.time = data[i].created_at;
        if(data[i].sended_by == user_send.id) {
          _message.from = data_req.from;
          _message.image = user_send.image;
          // _message.to = {
          //   user_name : data_req.to,
          //   image: user_receive.image
          // }
          _data.push(_message);
        }
        else {
          _message.from = data_req.to;
          _message.image = user_receive.image;
          // _message.to = {
          //   user_name : data_req.from,
          //   image: user_send.image
          // }
          _data.push(_message);
        }
      }
      wsocket.emit("get_messages_single", JSON.stringify({"data": _data}));
      wsocket.to(user_receive.socket_id).emit("get_messages_single", JSON.stringify({"data": _data}));
    })
    .catch(function(err) {
      console.log(err);
    });
  });

});

module.exports = web_socket;
