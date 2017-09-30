
/**
 * Author: Nguyen Hoang Anh
 * Helper: role_helper
 */

var models = require("../models");
var Q      = require("q");
var Utils  = require("../utils/utils")

var Recording_Helper = {

};

Recording_Helper.add_video = function(upload) {
  var message = {};
  var deferred = Q.defer();

  models.recording.build({
    room_name: upload.room_name,
    video_name: upload.video_name,
    user_name: upload.user_name,
    link: upload.link,
  })
  .save()
  .then(function(result) {
    message.data = result;
    deferred.resolve(message);
  })
  .catch(function(error) {
    Utils.error_log(error.message);
    message.error = error.message;
    deferred.reject(message);
  });
  return deferred.promise;
}

Recording_Helper.find_all = function() {
  var message = {};
  var deferred = Q.defer();

  models.recording.findAll()
  .then(function(recording) {
    message.data = recording;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Recording_Helper;
