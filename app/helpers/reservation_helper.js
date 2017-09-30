/**
 * Author: Nguyen Hoang Anh
 * Helper: reservation_helper
 */

var models                 = require("../models");
var Q                      = require("q");
var Utils                  = require("../utils/utils");
var Base64                 = require('../utils/base64.js');
var room_invitation_helper = require('./room_invitation_helper');
var config                 = require('../../config/config')();
var async                  = require('async');

var Reservation_Helper = {

};

Reservation_Helper.create = function(reservation) {
  var message  = {};
  var deferred = Q.defer();
  models.Reservation.create({
    made_at: reservation.made_at,
    description: reservation.description,
    status: reservation.status,
    user_id: reservation.user_id
  })
  .then(function(reservation) {
    message.data = reservation;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.update = function(reservation) {
  var message  = {};
  var deferred = Q.defer();

  models.Reservation.update({
    made_at: reservation.made_at,
    description: reservation.description,
    status: reservation.status,
    user_id: reservation.user_id
  }, {
    where: {
      id: reservation.id
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

Reservation_Helper.destroy_reservation = function(reservation) {
  var deferred = Q.defer();

  models.Reservation.update({
    status: reservation.status
  },{
    where: {
      id: reservation.id
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

Reservation_Helper.find_all = function(user_id) {
  var message  = {};
  var deferred = Q.defer();

  models.Reservation.findAll({
    where: {
      id: user_id
    }
  })
  .then(function(reservations) {
    message.data = reservations;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.update_status = function(reverse_id, status) {
  var message  = {};
  var deferred = Q.defer();

  models.Reservation.update({
    status: status
  }, {
    where: {
      id: reverse_id
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

Reservation_Helper.get_reserve_by_user = function(user_id) {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 1 ' +
              'AND Room_Invitation.user_id = ? ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ replacements: [user_id], type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link  = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_reserve_future = function(user_id, start_at, end_at) {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, User, Room, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Room_Invitation.user_id = ? ' +
              'AND Reservation.status = 0 AND UNIX_TIMESTAMP(made_at) BETWEEN ? AND ? ' +
              'ORDER BY started_at DESC';
  models.sequelize.query(query, {replacements: [user_id, start_at, end_at], type: models.sequelize.QueryTypes.SELECT})
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link  = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_reserve_this_month = function(user_id, start_at, end_at) {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, User, Room, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Room_Invitation.user_id = ? ' +
              'AND UNIX_TIMESTAMP(made_at) BETWEEN ? AND ? ' +
              'ORDER BY started_at DESC';
  models.sequelize.query(query, {replacements: [user_id, start_at, end_at], type: models.sequelize.QueryTypes.SELECT})
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link  = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_schedule_by_user = function(user_id) {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 0 ' +
              'AND Room_Invitation.user_id = ? ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ replacements: [user_id], type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_all_schedule_system = function() {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT DISTINCT User.id as id, user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status, Reservation.id as reverse_id ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 0 ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.users = [];
        for(var i = 0; i < users.data.length; i++) {
          reservation.users.push({user_id: users.data[i].id, room_id: reservation.room_id});
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_reserve_previous_by_user = function(user_id) {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 2 ' +
              'AND Room_Invitation.user_id = ? ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ replacements: [user_id], type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message)
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

// Viet query lay tat ca cac room: da hop, dang hop, se hop cho 3 ham duoi day a, hien tai em dang
// lay theo tung ca nhan giong anh viet de cho no chay :3
Reservation_Helper.get_all_reserve = function() {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT DISTINCT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 1 ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link  = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message);
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_all_schedule = function() {
  var message  = {};
  var deferred = Q.defer();
  var query = 'SELECT DISTINCT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id  AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 0 ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message);
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Reservation_Helper.get_all_reserve_previous = function() {
  var message  = {};
  var deferred = Q.defer();

  var query = 'SELECT DISTINCT user_name, first_name, last_name, Room.id as room_id, room_code, room_name, Room.description, limited, ' +
              'made_at, started_at, ended_at, Room.status ' +
              'FROM Reservation, Room, User, Room_Invitation ' +
              'WHERE Reservation.id = Room.reverse_id AND User.id = Reservation.user_id ' +
              'AND Room.id = Room_Invitation.room_id ' +
              'AND Reservation.status = 2 ' +
              'ORDER BY started_at DESC';

  models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT })
  .then(function(reservations) {
    var data = [];
    async.each(reservations, function(reservation, callback) {
      room_invitation_helper.find_by_room(reservation.room_id)
      .then(function(users) {
        reservation.link = Base64.encode(reservation.room_code);
        reservation.users = users.data;
        for(var i = 0; i < reservation.users.length; i++) {
          reservation.users[i].image = config.HOST + reservation.users[i].image;
        }
        data.push(reservation);
        callback();
      }, function(message_error) {
        message.error = message_error.error;
        callback(message);
      });
    }, function(error) {
      if(error) {
        message.data = error;
        return deferred.reject(message);
      }
      else {
        message.data = data;
        return deferred.resolve(message);
      }
    });
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};
module.exports = Reservation_Helper;
