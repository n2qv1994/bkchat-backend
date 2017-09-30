/**
 * Author: Nguyen Hoang Anh
 * Services: chat_services
 */

var Base64       = require('../utils/base64.js');
var session_user = require('../wsserver/session_user');
var uuid         = require('node-uuid');
var moment       = require('moment-timezone');
var notification_services  = require('../services/notification_services');
var env                    = process.env.NODE_ENV || 'development';
var config                 = require(__dirname + '/../../config/config.json')[env];

var Chat_Service = {

};

Chat_Service.chat_single = function(request, wsocket) {

  var user_send    = session_user.find_user(request.from.user_name);
  var user_receive = session_user.find_user(request.to);

  if (user_send === null || user_receive === null ) {
    return;
  };

  var save_message = {
    content: request.message,
    sended_by: user_send.id,
    recieved_by: user_receive.id,
    // room_id: 0,
    // room_id: "null",
    message_type: 2
  };

  var notify_message = {
    notice_code: uuid.v1(),
    notice_by: user_send.id,
    name: user_send.user_name,
    notice_image: user_send.image,
    notice_room: "null",
    notice_type: "chat",
    notice_body: user_send.user_name + " sent you a message",
    send_at: moment.tz(config.zone).utc().toDate().toString(),
    readed: 0,
    user_id: user_receive.id
  };

  notification_services.store_nofification_message(user_send, user_receive, save_message, notify_message, function(err,data) {
    if(err) {
      Utils.error_log(err);
    }
    else {
      wsocket.to(user_receive.socket_id).emit('notify', JSON.stringify({"data": data}));
      wsocket.to(user_receive.socket_id).emit('chat_with_single_user', JSON.stringify({ "data": request }));
    }
  });
};

module.exports = Chat_Service;
