/**
 * Author: Nguyen Hoang Anh
 * Controllers: meeting_controller
 */

var meeting_service = require('../services/meeting_services');
var Base64          = require('../utils/base64');

exports.get_schedule = function(req, res) {
  meeting_service.get_schedule(req.decoded.user_code, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.get_meeting = function(req, res) {

  meeting_service.get_meeting(req.decoded.user_code, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.get_previous_meeting = function(req, res) {

  meeting_service.get_previous_meeting(req.decoded.user_code, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.get_room = function(req, res) {
  var room_code = req.params.room_code;

  if(room_code === "" || room_code === undefined) {
		var err = "Params's not invalid";
		return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
	}

  meeting_service.get_room(room_code, function(error, result) {
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

exports.get_reserve_this_month = function(req, res) {
  meeting_service.get_reserve_this_month(req.decoded.user_code, function(error, result) {
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
  })
};

exports.reserve_room = function(req, res) {
  var reserve = {};
  reserve.room_name    = req.body.room_name    || '';
  reserve.started_at   = req.body.started_at   || '';
  reserve.user_invited = JSON.parse(req.body.user_invited) || '';
  reserve.limited      = req.body.limited      || '';
  reserve.description  = req.body.description  || '';

  if(reserve.room_name === '' || reserve.started_at === '' || reserve.user_invited.length === 0 || reserve.limited === '') {
    return res.status(401).json({
      "error": {
        "data": "Params's invalid"
      },
      "status_code": 401
    });
  }

  if(reserve.limited < reserve.user_invited.length) {
    return res.status(401).json({
      "error": {
        "data": "Params's invalid"
      },
      "status_code": 401
    });
  }

  meeting_service.reserve_room(reserve, req.decoded.user_code, function(error, result) {
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

exports.create_room = function(req, res) {
  var users_req = req.body.list_user || '';

  if(users_req === undefined || users_req === '') {
    return res.status(400).json({
      "error": {
        "data": "list_user's invalid"
      },
      "status_code": 400
    });
  }

  var users = JSON.parse(users_req) || [];
  if(users.length === 0) {
    return res.status(400).json({
      "error": {
        "data": "list_user's not blank"
      },
      "status_code": 400
    });
  }
  else if(typeof users === "string") {
    return res.status(400).json({
      "error": {
        "data": "list_user's invalid, must be array"
      },
      "status_code": 400
    });
  }

  // if((new Set(users)).size !== users.length) {
  //   return res.status(400).json({
  //     "error": {
  //       "data": "list_user's duplicate"
  //     },
  //     "status_code": 400
  //   });
  // }

  meeting_service.create_room(users, req.decoded.user_code, function(error, result) {
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

exports.join_room = function(req, res) {
  console.log(req.decoded);
  console.log(req.params.room_code);
  var user  = req.decoded;
  var room_code = req.params.room_code;

  if(room_code === "" || room_code === undefined) {
    var err = "Params's not invalid";
    return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
  }


};

exports.update_room = function(req, res) {

};

exports.get_all_schedule = function(req, res) {
  meeting_service.get_all_schedule(function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.get_all_meeting = function(req, res) {

  meeting_service.get_all_meeting(function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.get_all_previous = function(req, res) {

  meeting_service.get_all_previous(function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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
