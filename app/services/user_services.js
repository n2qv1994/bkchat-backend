/**
 * Author: Nguyen Hoang Anh
 * Services: user_services
 */

var user_helper     = require("../helpers/user_helper");
var activity_helper = require("../helpers/activity_helper");
var message_helper = require("../helpers/messages_helper");
var bcrypt          = require("bcrypt");
var Utils           = require("../utils/utils");
var config          = require('../../config/config')();

var status = {
  online: 0,
  offline: 1,
  busy: -1
};

var User_Services = {

};

User_Services.login = function(user_info, callback) {
  user_helper.find_by_name(user_info.user_name)
  .then(function(message) {
    var user = message.data;
    if(!user) {
      return callback(false, {data: "Not found user", status_code: 404, status: "error"});
    }
    else {
      bcrypt.compare(user_info.pass_word, user.pass_word, function (error, res) {
        if(error) {
          return callback(false, {data: error, status_code: 500, status: "error"});
        }
        else {
          if(res) {
            user.status = status.online;
            user_helper.update_status(user)
            .then(function(message) {
              var data = {
                user_id: user.id,
                user_code: user.user_code,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                image: config.HOST + user.image,
                address: user.address,
                phone: user.phone,
                user_name: user.user_name,
                created_at: user.created_at,
                enabled: user.enabled,
                status: user.status,
                role_id: user.role_id
              };
              return callback(true, {data: data, status_code: 200, status: "success"});
            }, function(message_error) {
              Utils.log(message_error.error);
              return callback(false, {data: message_error.error, status_code: 500, status: "error"});
            });

            // Insert action
            var action = {
              user_id: user.id,
              action_id: global.activity_type["LOGIN"].id
            };
            activity_helper.create(action)
            .then(function(message) {
              Utils.log(message.data);
            }, function(message_error) {
              Utils.log(message_error.error);
            });
          }
          else {
            return callback(false, {data: "password's not correct", status_code: 401, status: "failed"});
          }
        }
      });
    }
  }, function(message_error) {
    Utils.log(message_error.error);
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
};

User_Services.get_users = function(callback) {
  user_helper.find_all()
  .then(function(message) {
    var list_user = [];
    for (var i = 0; i < message.data.length; i++) {
      if("admin" === message.data[i].user_name) {
        continue;
      }
      var user = {};
      user.user_id    = message.data[i].id;
      user.first_name = message.data[i].first_name;
      user.last_name  = message.data[i].last_name;
      user.email      = message.data[i].email;
      user.image      = config.HOST + message.data[i].image;
      user.address    = message.data[i].address;
      user.phone      = message.data[i].phone;
      user.user_name  = message.data[i].user_name;
      user.user_code  = message.data[i].user_code;
      user.enabled    = message.data[i].enabled;
      user.status     = message.data[i].status;
      user.role_id    = message.data[i].role_id;
      user.created_at = message.data[i].created_at;
      user.updated_at = message.data[i].updated_at;
      list_user.push(user);
    };
    return callback(true, {data: list_user, status_code: 200, status: "success"});
  }, function(message_error) {
    Utils.error_log(message_error.error);
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
};

User_Services.get_user = function(user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data: "Not found user", status_code: 400, status: "error"});
    }
    var user = {};
    user.user_id    = message.data.id;
    user.first_name = message.data.first_name;
    user.last_name  = message.data.last_name;
    user.email      = message.data.email;
    user.image      = config.HOST + message.data.image;
    user.address    = message.data.address;
    user.phone      = message.data.phone;
    user.user_name  = message.data.user_name;
    user.user_code  = message.data.user_code;
    user.status     = message.data.status;
    return callback(true, {data: user, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
};

User_Services.update_profile = function(user_code, user, callback) {
  user_helper.update(user_code, user)
  .then(function(message) {
    return callback(true, {data: message.data, status_code: 201, status: "success"});
  }, function(message_error) {
    return callback(false, {data: message.data, status_code: 500, status: "error"});
  });
};

User_Services.change_pass = function(user_code, old_pass, new_pass, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(false, {data: "Not found user", status_code: 404, status: "error"});
    }
    bcrypt.compare(old_pass, message.data.pass_word, function (error, res) {
      if(error) {
        return callback(false, {data: error, status_code: 500, status: "error"});
      }
      else {
        if(res) {
          bcrypt.hash(new_pass, config.salt_rounds, function(error, hash) {
            if(error) {
              return callback(false, {data: error, status_code: 500, status: "error"});
            }
            user_helper.update(user_code, {pass_word: hash})
            .then(function(message) {
              return callback(true, {data: message.data, status_code: 201, status: "success"});
            }, function(message_error) {
              return callback(false, {data: message.data, status_code: 500, status: "error"});
            });
          });
        }
        else {
          return callback(false, {data: "password's not correct", status_code: 401, status: "failed"});
        }
      }
    });
  }, function(message_error) {
    return callback(false, {data: message.data, status_code: 500, status: "error"});
  });
};

User_Services.get_message_history = function(id_1, id_2, callback) {
  message_helper.get_messages_single(id_1,id_2)
  .then(function(message) {
    return callback(false, {data: message.data, status_code: 200, status: "success"});
  })
  .catch(function(err) {
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  })
};

User_Services.create_user = function(user_info, callback) {
  user_helper.find_by_name(user_info.user_name)
  .then(function(message) {
    var user = message.data;
    if(user) {
      return callback(true, {data: "User existed", status_code: 500, status: "error"});
    }
    else {
      bcrypt.hash(user_info.pass_word, config.salt_rounds, function(error, hash) {
        if(error) {
          return callback(true, {data: error, status_code: 500, status: "error"});
        }
        user_info.pass_word = hash;
        user_helper.create_user(user_info)
        .then(function(message) {
          return callback(false, {data: message.data, status_code: 201, status: "success"});
        })
        .catch(function(message_error) {
          Utils.log(message_error.error);
          return callback(true, {data: message_error.error, status_code: 500, status: "error"});
        });
      });
    }
  }, function(message_error) {
    Utils.log(message_error.error);
    return callback(true, {data: message_error.error, status_code: 500, status: "error"});
  });
};

module.exports = User_Services;
