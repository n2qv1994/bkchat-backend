/**
 * Author: Nguyen Hoang Anh
 * Helper: activity_helper
 */

var models    = require("../models");
var Q         = require('q');
var Utils     = require("../utils/utils");

var Activity_Helper = {

};

Activity_Helper.create = function(activity) {
  var message = {};
  var deferred = Q.defer();

  models.Activity.build({
    user_id: activity.user_id,
    action_id: activity.action_id,
    conversation_id: activity.conversation_id || null,
    reverse_id: activity.reverse_id || null
  })
  .save()
  .then(function(result) {
    message.data = "success";
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Activity_Helper.find_all = function(user_id) {
  var message = {};
  var deferred = Q.defer();

  models.Activity.findAll({
    where: {user_id: user_id}
  })
  .then(function(activities) {
    message.data = activities;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Activity_Helper.find_by_id = function(action_id) {
  var message = {};
  var deferred = Q.defer();

  models.Activity.findAll({
    where: {
      action_id: action_id
    }
  })
  .then(function(activities) {
    message.data = activities;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Activity_Helper.find_by_user_id = function(user_id, offset) {
  var message  = {};
  var deferred = Q.defer();
  var offset   = offset || 0;

  var query = "SELECT Activity.id as activity_id, Activity_Type.id as activity_type_id, " +
              "Activity_Type.action_name, Activity.created_at " +
              "FROM Activity_Type, Activity " +
              "WHERE Activity.action_id = Activity_Type.id " +
              "AND Activity.user_id = ? ORDER BY Activity.created_at DESC LIMIT 10 OFFSET ?";

  models.sequelize.query(query, { replacements: [user_id, offset], type: models.sequelize.QueryTypes.SELECT })
  .then(function(data) {
    message.data = data;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Activity_Helper;
