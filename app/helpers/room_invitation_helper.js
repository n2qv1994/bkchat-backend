/**
 * Author: Nguyen Hoang Anh
 * Helper: room_invitation_helper
 */

var models = require("../models");
var Q      = require('q');
var Utils  = require("../utils/utils");

var Room_Invitation_Helper = {

};

Room_Invitation_Helper.create = function(room_invitation) {
  var message = {};
  var deferred = Q.defer();

  models.Room_Invitation.build({
    user_id: room_invitation.user_id,
    room_id: room_invitation.room_id
  })
  .save()
  .then(function(result) {
    Utils.log(result);
    message.data = "success";
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Invitation_Helper.bulk_create = function(list_invite) {
  var message = {};
  var deferred = Q.defer();

  models.Room_Invitation.bulkCreate(list_invite)
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

Room_Invitation_Helper.delete = function(room_invitation) {
  var message = {};
  var deferred = Q.defer();

  models.Room_Invitation.destroy({
    where: {
      user_id: room_invitation.user_id,
      room_id: room_invitation.room_id
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

Room_Invitation_Helper.find_by_room = function(room_id) {
  var message = {};
  var deferred = Q.defer();

  models.Room_Invitation.findAll(
  {
    attributes: ['user_id']
  },{
    where: {
      room_id: room_id
    }
  })
  .then(function(user_ids) {
    var ids = [];

    for(var i = 0; i < user_ids.length; i++) {
      ids.push(user_ids[i].user_id);
    }

    models.User.findAll({
      attributes: ['id', 'user_name', 'user_code', 'first_name', 'last_name', 'email', 'image']
    }, {
      where: {
        id: {
          $in: ids
        }
      }
    })
    .then(function(users) {
      message.data = users;
      return deferred.resolve(message);
    })
    .catch(function(error) {
      message.error = error;
      return deferred.reject(message);
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Invitation_Helper.find_by_user = function(user_id) {
  var message = {};
  var deferred = Q.defer();

  models.Room_Invitation.findAll(
  {
    attributes: ['room_id']
  },{
    where: {
      user_id: user_id
    }
  })
  .then(function(room_ids) {
    var ids = [];
    for(var i = 0; i < room_ids.length; i++) {
      ids.push(room_ids[i].room_id);
    }
    models.Room.findAll({
      attributes: ['id', 'room_name','description','limited','started_at','ended_at','reverse_id','created_at','updated_at']
    }, {
      where: {
        id: {
          $in: ids
        }
      }
    })
    .then(function(rooms) {
      message.data = rooms;
      return deferred.resolve(message);
    })
    .catch(function(error) {
      message.error = error;
      return deferred.reject(message);
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Room_Invitation_Helper.check_invitation = function(user_id, room_id) {
  var message = {};
  var deferred = Q.defer();
  models.Room_Invitation.findAll(
  {
    where: {
      user_id: user_id,
      room_id: room_id
    }
  })
  .then(function(result) {
    return deferred.resolve(result);  
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Room_Invitation_Helper;
