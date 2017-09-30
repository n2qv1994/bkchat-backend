/**
 * Author: Nguyen Hoang Anh
 * Controllers: activity_controller
 */

var activity_service = require('../services/activity_services');

exports.get_activities = function(req, res) {
  var offset  = parseInt(req.params.offset) || 0;

  activity_service.get_activities(req.decoded.user_code, offset, function(error, result) {
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
