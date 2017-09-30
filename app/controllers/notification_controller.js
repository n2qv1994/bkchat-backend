var notification_service = require('../services/notification_services');

exports.get_notifications = function(req, res) {
  var page  = req.query.page;
  var limit = req.query.limit;

  if(page === undefined || page === null || page === '' || limit === undefined || limit === null || limit === '') {
    var err = "Params's not invalid";
    return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
  }
  page = parseInt(page);
  limit = parseInt(limit);

  notification_service.get_notify(req.decoded.user_id, limit, page, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.data
        },
        "status_code": result.status_code
      });
    }
    return res.status(result.status_code).json({
      "success": {
        "data": result.data
      },
      "status_code": result.status_code,
      "panigation": {
        "total": result.data.length,
        "per_page": limit,
        "current_page": page
      }
    });
  });
};

exports.get_unread_notifications = function(req, res) {
  notification_service.get_unread_notify(req.decoded.user_id, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.data
        },
        "status_code": result.status_code
      });
    }
    return res.status(result.status_code).json({
      "success": {
        "data": result.data[0]
      },
      "status_code": result.status_code
    });
  });
};

exports.read_notify = function(req, res) {
  var notify_id = req.body.notify_id || '';

  if(notify_id === '') {
    var err = "Params's not invalid";
    return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
  }

  notification_service.update_read(notify_id, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.data
        },
        "status_code": result.status_code
      });
    }
    return res.status(result.status_code).json({
      "success": {
        "data": result.data
      },
      "status_code": result.status_code
    });
  });
};
