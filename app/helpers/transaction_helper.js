/**
 * Author: Nguyen Hoang Anh
 * Helper: transaction_helper
 */

var models = require("../models");
var Q      = require("q");
var Utils  = require("../utils/utils");

var Transaction_Helper = {

};

Transaction_Helper.create = function(transaction) {
  var message = {};
  var deferred = Q.defer();

  models.Transaction.build({
    transaction_code: transaction.transaction_code,
    user_id: transaction.user_id,
    room_id: transaction.room_id,
    action_id: transaction.action_id
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

Transaction_Helper.update_action = function(transaction) {
  var message = {};
  var deferred = Q.defer();

  models.Transaction.update({
    action_id: transaction.action_id
  }, {
    where: {
      room_id: transaction.room_id
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

module.exports = Transaction_Helper;
