
/**
 * Author: Nguyen Hoang Anh
 * Helper: role_helper
 */

var models = require("../models");
var Utils  = require("../utils/utils");

var Role_Helper = {

};

Role_Helper.create = function(role) {
  var message = {};
  models.Role.build({
    role_code: role.role_code,
    role_name: role.role_name,
    description: role.description,
    enabled: role.enabled
  })
  .save()
  .then(function(result) {
    Utils.log(result);
    message.data = result;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

Role_Helper.update = function(role) {
  var message = {};
  models.Role.update({
    role_name: role.role_name,
    description: role.description,
    enabled: role.enabled
  }, {
    where: {
      id: role.id
    }
  })
  .then(function(result) {
    Utils.log(result);
    message.data = result;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

Role_Helper.delete = function(role_id) {
  var message = {};
  models.Role.destroy({
    where: {
      id: role_id
    }
  })
  .then(function(result) {
    Utils.log(result);
    message.data = result;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

Role_Helper.find_by_id = function(role_id) {
  var message = {};
  models.Role.findById(role_id)
  .then(function(role) {
    message.data = role;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

Role_Helper.find_by_name = function(role_name) {
  var message = {};
  models.Role.findAll({
    where: {
      role_name: role_name
    }
  })
  .then(function(roles) {
    message.data = roles;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

Role_Helper.find_all = function() {
  var message = {};
  models.Role.findAll()
  .then(function(roles) {
    message.data = roles;
    return message;
  })
  .catch(function(error) {
    Utils.log(error);
    message.error = error;
    return message;
  });
};

module.exports = Role_Helper;
