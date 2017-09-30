/**
 * Author: Nguyen Hoang Anh
 * Helper: room_helper
 */

var models = require("../models");
var room_invitation_helper = require('./room_invitation_helper');
var Base64 = require('../utils/base64');
var config = require('../../config/config')();
var Utils  = require("../utils/utils");
var Q      = require("q");

var Room_Helper = {

};

Room_Helper.create = function(room) {
   var message = {};
   var deferred = Q.defer();

   models.Room.create({
     room_code: room.room_code,
     room_name: room.room_name,
     description: room.description,
     limited: room.limited,
     started_at: room.started_at,
     ended_at: room.ended_at,
     enabled: room.enabled,
     status: room.status,
     reverse_id: room.reverse_id
   })
   .then(function(room) {
     message.data = room;
     return deferred.resolve(message);
   })
   .catch(function(error) {
     message.error = error;
     return deferred.reject(message);
   });

   return deferred.promise;
};

Room_Helper.create_1 = function(room) {
   var message = {};
   var deferred = Q.defer();

   models.Room.create({
     room_code: room.room_code,
     room_name: room.room_name,
     started_at: room.started_at,
     enabled: room.enabled,
     status: room.status
   })
   .then(function(room) {
     message.data = room;
     return deferred.resolve(message);
   })
   .catch(function(error) {
     message.error = error;
     return deferred.reject(message);
   });

   return deferred.promise;
};

Room_Helper.update = function(room) {
   var message = {};
   var deferred = Q.defer();

   models.Room.update({
     room_code: room.room_code,
     room_name: room.room_name,
     description: room.description,
     limited: room.limited,
     started_at: room.started_at,
     ended_at: room.ended_at,
     enabled: room.enabled,
     status: room.status
   }, {
     where: {
       id: room.id
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

Room_Helper.get_room_with_status = function(status) {
  var message = {};
  var deferred = Q.defer();

  models.Room.findAll({
    where: {status: status}
  })
  .then(function(rooms) {
    message.data = rooms;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Helper.find_room_valid = function(room_code) {
  var message = {};
  var deferred = Q.defer();
  var query = "SELECT * FROM Room WHERE room_code = ? AND status = 1";

  models.sequelize.query(query, { replacements: [room_code], type: models.sequelize.QueryTypes.SELECT })
  .then(function(rooms) {
    message.data = rooms;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Helper.find_room_by_code = function(room_code) {
  var message = {};
  var deferred = Q.defer();

  models.Room.find({
    where: {room_code: room_code}
  })
  .then(function(room) {
    message.data = room;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Helper.find_room_by_name = function(room_name) {
  var message = {};
  var deferred = Q.defer();

  models.Room.find({
    where: {room_name: room_name}
  })
  .then(function(room) {
    message.data = room;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};


Room_Helper.update_room_status = function(room_code, status) {
  var message = {};
  var deferred = Q.defer();

  models.Room.update({
    status: 1,
    enabled: 1
  },{
    where: {
      room_code: room_code
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

Room_Helper.find_by_room_code_exclude_id = function(room_code) {
  var message = {};
  var deferred = Q.defer();
  models.Room.find({
    where: {room_code: room_code},
    attributes: ['id', 'room_name', 'room_code', 'description','limited','started_at','ended_at',
                 'enabled','status','reverse_id','created_at','updated_at']
  })
  .then(function(room) {
    room_invitation_helper.find_by_room(room.id)
    .then(function(users) {
      var data = {};
      data.room_name = room.room_name;
      data.room_code = room.room_code;
      data.description = room.description;
      data.limited = room.limited;
      data.started_at = room.started_at;
      data.ended_at = room.ended_at;
      data.enabled = room.enabled;
      data.status = room.status;
      data.reverse_id = room.reverse_id;
      data.created_at = room.created_at;
      data.updated_at = room.updated_at;
      data.link = Base64.encode(room.room_code);
      data.users = users.data;
      for(var i = 0; i < data.users.length; i++) {
        data.users[i].image = config.HOST + data.users[i].image;
      }
      message.data = data;
      return deferred.resolve(message);
    }, function(message_error) {
      message.error = message_error.error;
      return deferred.reject(message);
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Room_Helper;
