var recording_helper = require('../helpers/recording_helper');

var moment             = require('moment');
var Base64             = require('../utils/base64');
var Recording_Services = {};

Recording_Services.get_all_recording = function(callback) {
  recording_helper.find_all()
  .then(function(message) {
    return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

Recording_Services.add_video = function(upload, callback) {
  recording_helper.add_video(upload)
  .then(function(message) {
    return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};


module.exports = Recording_Services;