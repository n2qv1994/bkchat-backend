var room_invitation_helper = require("../helpers/room_invitation_helper");
var Utils           	   = require("../utils/utils");

var History_Services = {

};

History_Services.invited = function(user_id, callback) {
	room_invitation_helper.find_by_user(user_id)
	  .then(function(message) {
	    return callback(true, {data: message.data, status_code: 200, status: "success"});
	  }, function(message_error) {
	    Utils.error_log(message_error.error);
	    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
	});
};

module.exports = History_Services;