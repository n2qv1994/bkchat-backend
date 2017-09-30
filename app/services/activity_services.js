/**
 * Author: Nguyen Hoang Anh
 * Services: activity_services
 */

var activity_helper      = require('../helpers/activity_helper');
var user_helper          = require('../helpers/user_helper');
var activity_type_helper = require('../helpers/activity_type_helper');

var Utils                = require('../utils/utils');

var Activity_Services = {

};

Activity_Services.get_activities = function(user_code, offset, callback) {
	user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data: "Not found user", status_code: 400, status: "error"});
    }
		activity_helper.find_by_user_id(message.data.id, offset)
		.then(function(activities) {
			return callback(true, {data: activities.data, status: "success", status_code: 200});
		})
		.catch(function(message_error) {
			return callback(false, {data: message_error.error.message, status_code: 500, status: "error"});
		});
	}, function(message_error) {
		return callback(false, {data: message_error.error, status_code: 500, status: "error"});
	});
};

module.exports = Activity_Services;
