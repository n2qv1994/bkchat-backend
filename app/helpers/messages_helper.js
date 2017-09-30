/**
 * Author: Nguyen Hoang Anh
 * Helper: message_helper
 */

var models = require("../models");
var Q      = require('q');
var Utils  = require("../utils/utils");

var Message_Helper = {

};

Message_Helper.create = function(message) {
  var data = {};
  var deferred = Q.defer();

  if(message.room_id !== undefined) {
    models.Message.build({
      content: message.content,
      sended_by: message.sended_by,
      recieved_by: message.recieved_by,
      room_id: message.room_id,
      message_type: message.message_type
    })
    .save()
    .then(function(result) {
      data.data = "success";
      return deferred.resolve(data);
    })
    .catch(function(error) {
      data.error = error;
      return deferred.reject(data);
    });

    return deferred.promise;
  }
  else {
    models.Message.build({
      content: message.content,
      sended_by: message.sended_by,
      recieved_by: message.recieved_by,
      message_type: message.message_type
    })
    .save()
    .then(function(result) {
      data.data = "success";
      return deferred.resolve(data);
    })
    .catch(function(error) {
      data.error = error;
      return deferred.reject(data);
    });

    return deferred.promise;
  }
};

Message_Helper.bulk_create = function(list_message) {
  var message = {};
  var deferred = Q.defer();

  models.Message.bulkCreate(list_message)
  .then(function() {
    message.data = "success";
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Message_Helper.find_all = function(room_id) {
  var message = {};
  var deferred = Q.defer();

  var query = "SELECT USER_SEND.user_name AS user_send, USER_SEND.image AS image_user_send, " +
              "USER_RECIEVE.user_name AS user_recieve, USER_RECIEVE.image AS image_user_recieve, " +
              "content, Message.created_at " +
              "FROM User AS USER_SEND, User AS USER_RECIEVE, Message, Room " +
              "WHERE Room.id = Message.room_id " +
              "AND USER_SEND.id = Message.sended_by AND USER_RECIEVE.id = Message.recieved_by " +
              "AND Message.room_id = ?";

  models.sequelize.query(query, { replacements: [room_id], type: models.sequelize.QueryTypes.SELECT })
  .then(function(messages) {
    message.data = messages;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Message_Helper.get_messages_single = function(id_1, id_2) {
  var message = {};
  var deferred = Q.defer();

  models.Message.findAll({
    where : {
      message_type: 2,
      $or : [{sended_by: id_1},{sended_by: id_2}]
    },
    limit: 20,
    order: 'id DESC'
  })
  .then(function(message) {
    message.data = message;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Message_Helper;
