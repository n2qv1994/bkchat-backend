/**
 * Author: Nguyen Hoang Anh
 * Helper: notification_helper
 */

var models = require("../models");
var Utils  = require("../utils/utils");
var Q      = require("q");
var Notification_Helper = {

};

Notification_Helper.create = function(notify) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.create({
    notice_code: notify.notice_code,
    notice_by: notify.notice_by,
    name: notify.name,
    notice_image: notify.notice_image,
    notice_type: notify.notice_type,
    notice_body: notify.notice_body,
    notice_room: notify.notice_room,
    send_at: notify.send_at,
    readed: notify.readed,
    created_at: notify.created_at,
    updated_at: notify.updated_at,
    user_id: notify.user_id
  })
  .then(function(notify) {
    message.data = notify;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Notification_Helper.update = function(notify) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.update({
    notice_body: notify.notice_body,
    readed: notify.readed
  }, {
    where: {
      user_id: notify.user_id
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

Notification_Helper.update_chat = function(notify) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.update({
    notice_body: notify.notice_body,
    readed: notify.readed
  }, {
    where: {
      id: notify.notify_id
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

Notification_Helper.read = function(notify_id) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.update({
    readed: 1
  }, {
    where: {
      id: notify_id
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

Notification_Helper.delete = function(notice_id) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.destroy({
    where: {
      id: notice_id
    }
  })
  .then(function(result) {
    message.data = "success";
    return deferred.resolve(message);;
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);;
  });

  return deferred.promise;
};

Notification_Helper.find_by_id = function(notice_id) {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.findById(notice_id)
  .then(function(notify) {
    message.data = notify;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Notification_Helper.find_all = function() {
  var message  = {};
  var deferred = Q.defer();

  models.Notification.findAll()
  .then(function(notifications) {
    message.data = notifications;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Notification_Helper.find_notification = function(user_send_id,user_receive_id) {
  var message  = {};
  var deferred = Q.defer();
  models.Notification.find( {
    where: {
      notice_type: "chat",
      $and: [
        { notice_by: user_send_id },
        { user_id: user_receive_id }
      ]
    }
  })
  .then(function(notifications) {
    message.data = notifications;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });
  return deferred.promise;
};

Notification_Helper.find_range = function(user_id, limit, page) {
  var message  = {};
  var deferred = Q.defer();
  var offset   = page;
  var limit    = limit;

  var query = "SELECT id as id, notice_by as user_id, name as user_name, " +
              "notice_room as notify_content_code, notice_image as user_image, notice_body as notify_content, " +
              "notice_type as notify_type, send_at as time_until_now, readed as is_readed " +
              "FROM Notification " +
              "WHERE Notification.user_id = ? " +
              "ORDER BY created_at DESC LIMIT ? OFFSET ?";

  models.sequelize.query(query, { replacements: [user_id, limit, offset], type: models.sequelize.QueryTypes.SELECT })
  .then(function(data) {
    message.data = data;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

Notification_Helper.get_unread_notify = function(user_id) {
  var message  = {};
  var deferred = Q.defer();

  var query = "SELECT COUNT(id) as unread_count FROM Notification WHERE user_id = ? AND readed = 0";

  models.sequelize.query(query, { replacements: [user_id], type: models.sequelize.QueryTypes.SELECT })
  .then(function(data) {
    message.data = data;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error;
    return deferred.reject(message);
  });

  return deferred.promise;
};

module.exports = Notification_Helper;
