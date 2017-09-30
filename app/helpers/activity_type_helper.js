/**
 * Author: Nguyen Hoang Anh
 * Helper: activity_type_helper
 */

var models    = require("../models");
var sequelize = require('sequelize');
var Q         = require('q');
var Utils     = require("../utils/utils");

var Activity_Type_Helper = {

};

Activity_Type_Helper.create = function(activity) {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.build({
    action_code: activity.action_code,
    action_name: activity.action_name,
    enabled: activity.enabled
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

Activity_Type_Helper.update = function(activity) {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.update({
    action_code: activity.action_code,
    action_name: activity.action_name,
    enabled: activity.enabled
  }, {
    where: {
      id: activity.id
    }
  })
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

Activity_Type_Helper.delete = function(activity_id) {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.destroy({
    where: {
      id: activity_id
    }
  })
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

Activity_Type_Helper.find_by_id = function(action_id) {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.findById(action_id)
  .then(function(activity) {
    message.data = activity;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Activity_Type_Helper.find_by_name = function(action_name) {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.findAll({
    where: {
      action_name: action_name
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

Activity_Type_Helper.find_all = function() {
  var message = {};
  var deferred = Q.defer();

  models.Activity_Type.findAll()
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

module.exports = Activity_Type_Helper;
