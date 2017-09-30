/**
 * Author: Nguyen Hoang Anh
 * Helper: user_helper
 */

var models = require("../models");
var Q      = require("q");
var Utils  = require("../utils/utils");
var uuid   = require('node-uuid');

var User_Helper = {

};

User_Helper.create_user = function(user) {
  var message = {};
  var deferred = Q.defer();

  models.User.build({
    user_code: uuid.v1(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    image: "images/default_ava.png",
    address: user.address,
    phone: user.phone,
    user_name: user.user_name,
    pass_word: user.pass_word,
    enabled: 1,
    status: 0,
    role_id: 2
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
};

User_Helper.update = function(user_code, user) {
  var message = {};
  var deferred = Q.defer();

  models.User.update(user, {
    where: {
      user_code: user_code
    }
  })
  .then(function(result) {
    message.data = "success";
    return deferred.resolve(message);
  })
  .catch(function(error) {
    Utils.error_log(error.message);
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.delete = function(user_id) {
  var message = {};
  var deferred = Q.defer();

  models.User.destroy({
    where: {
      id: user_id
    }
  })
  .then(function(result) {
    message.data = "success";
    deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.update_status = function(user) {
  var message = {};
  var deferred = Q.defer();

  models.User.update({
    status: user.status
  }, {
    where: {
      id: user.id
    }
  })
  .then(function(result) {
    message.data = "success";
    deferred.resolve(message);
  })
  .catch(function(error) {
    Utils.error_log(error.message);
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.find_by_id = function(user_id) {
  var message = {};
  var deferred = Q.defer();

  models.User.findById(user_id)
  .then(function(user) {
    message.data = user;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.find_by_name = function(user_name) {
  var message = {};
  var deferred = Q.defer();

  models.User.find({
    where: { user_name: user_name }
  })
  .then(function(user) {
    message.data = user;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.find_by_code = function(user_code) {
  var message = {};
  var deferred = Q.defer();

  models.User.find({
    where: { user_code: user_code }
  })
  .then(function(user) {
    message.data = user;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.find_all = function() {
  var message = {};
  var deferred = Q.defer();

  models.User.findAll()
  .then(function(users) {
    message.data = users;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.find_list_user = function(user_codes) {
  var message  = {};
  var deferred = Q.defer();

  models.User.findAll({
    attributes: ['id']
  }, {
    where: {
      user_code: {
        $in: user_codes
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

  return deferred.promise;
};

User_Helper.find_list_user_id = function(ids) {
  var message  = {};
  var deferred = Q.defer();

  models.User.findAll({
    attributes: ['id']
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

  return deferred.promise;
};

module.exports = User_Helper;
