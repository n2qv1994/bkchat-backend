/**
 * Author: Nguyen Hoang Anh
 * Helper: message_type_helper
 */

var models = require("../models");
var Q      = require('q');
var Utils  = require("../utils/utils");

var Message_Type_Helper = {

};

Message_Type_Helper.create = function(message_type) {
  var message = {};
  var deferred = Q.defer();

  models.Message_Type.build({
    message_type: message_type.name
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

Message_Type_Helper.update = function(message_type) {
  var message = {};
  var deferred = Q.defer();

  models.Message_Type.update({
    message_type: message_type.name
  }, {
    where: {
      id: message_type.id
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

Message_Type_Helper.delete = function(message_type_id) {
  var message = {};
  var deferred = Q.defer();

  models.Message_Type.destroy({
    where: {
      id: message_type_id
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

Message_Type_Helper.find_all = function() {
  var message = {};
  var deferred = Q.defer();

  models.Message_Type.findAll()
  .then(function(message_types) {
    message.data = message_types;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.data = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Message_Type_Helper;
