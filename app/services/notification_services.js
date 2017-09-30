/**
 * Author: Nguyen Hoang Anh
 * Services: notification_services
 */

var notification_helper      = require('../helpers/notification_helper');
var messages_helper          = require('../helpers/messages_helper');
var Utils                    = require('../utils/utils');
var moment                   = require('moment-timezone');
var config                   = require('../../config/config')();

var Notification_Services = {

};

Notification_Services.get_unread_notify = function(user_id, callback) {
	notification_helper.get_unread_notify(user_id)
	.then(function(message) {
		return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
	}, function(message_error) {
		return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
	});
};

Notification_Services.get_notify = function(user_id, limit, page, callback) {
	notification_helper.find_range(user_id, limit, page)
	.then(function(message) {
		for(var i = 0; i < message.data.length; i++) {
			message.data[i].user_image = config.HOST + message.data[i].user_image;
			message.data[i].time_until_now = moment(message.data[i].time_until_now).format('YYYY-MM-DD HH:mm Z');
		}
		return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
	}, function(message_error) {
		return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
	});
};

Notification_Services.update_read = function(notify_id, callback) {
	notification_helper.read(notify_id)
	.then(function(message) {
		return callback(true, {message: "", data: message.data, status_code: 201, status: "success"});
	}, function(message_error) {
		return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
	});
};

Notification_Services.store_nofification_message = function(user_send, user_receive, save_message, notify_message, callback) {
	messages_helper.create(save_message)
  .then(function(message) {

  }, function(error_message) {
    Utils.error_log(error_message.error);
  });
  notification_helper.find_notification(user_send.id,user_receive.id)
  .then(function(message) {
    var current_time = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm a DD/MM');
  	if(message.data === null) {
  		notification_helper.create(notify_message)
	    .then(function(message) {
	        var data = {
	          image: user_send.image,
	          from : user_send.user_name,
	          message: notify_message.notice_body,
	          notice_code: notify_message.notice_code,
	          readed: message.data.readed,
            time : current_time
	        };
	        return callback(false, data );
	      }, function(error_message) {
	        return callback(true, error_message.error);
	      }
	    );
  	}
  	else {
  		var notify = {
  			notice_body: notify_message.notice_body,
				send_at: notify_message.send_at,
  			readed: 0,
  			user_id: user_receive.id,
				notify_id: message.data.id
  		};

  		notification_helper.update_chat(notify)
  		.then(function() {
  			var data = {
	          image: user_send.image,
	          from : user_send.user_name,
	          message: save_message.content,
	          notice_code: notify_message.notice_code,
	          readed: 0,
            time : current_time
	        };

  			return callback(false, data);
  		}, function(error_message) {
  			return callback(true, error_message.error);
  		});
  	}
  }, function(error_message) {
  	return callback(true, error_message.error);
  });
};

module.exports = Notification_Services;
