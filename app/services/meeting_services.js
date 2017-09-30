/**
 * Author: Nguyen Hoang Anh
 * Services: meeting_services
 */
var reservation_helper = require('../helpers/reservation_helper');
var user_helper        = require('../helpers/user_helper');
var room_helper        = require('../helpers/room_helper');
var room_service       = require('./room_services');
var moment             = require('moment');
var Base64             = require('../utils/base64');

var Meeting_Services = {};

Meeting_Services.get_schedule = function(user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {message: "Not found user", data: {}, status_code: 400, status: "error"});
    }
    reservation_helper.get_schedule_by_user(message.data.id)
    .then(function(message) {
      return callback(true, {message:"", data: message.data, status_code: 200, status: "success"});
    }, function(message_error) {
      return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
    });
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

Meeting_Services.get_meeting = function(user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {message: "Not found user", data: {}, status_code: 400, status: "error"});
    }
    reservation_helper.get_reserve_by_user(message.data.id)
    .then(function(message) {
      return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
    }, function(message_error) {
      return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
    });
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

Meeting_Services.get_previous_meeting = function(user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {message: "Not found user", data: {}, status_code: 400, status: "error"});
    }
    reservation_helper.get_reserve_previous_by_user(message.data.id)
    .then(function(message) {
      return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
    }, function(message_error) {
      return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
    });
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
}

Meeting_Services.get_room = function(room_code, callback) {
  room_helper.find_by_room_code_exclude_id(room_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data:"Not found room", status_code: 400, status: "error"});
    }
    return callback(true, {data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    console.log("mmmmmmmmmmmmm");
    console.log(message_error);
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
}

Meeting_Services.get_reserve_this_month = function(user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data: "Not found user", status_code: 400, status: "error"});
    }
  	var start = moment().utcOffset("+07:00").startOf('month').valueOf()/1000;
  	var end = moment().utcOffset("+07:00").endOf('month').valueOf()/1000;

  	reservation_helper.get_reserve_this_month(message.data.id, start, end)
  	.then(function(message) {
  		return callback(true, {data: message.data, status: "success", status_code: 200});
  	}, function(message_error) {
  		return callback(false, {data: message_error.error, status: "error", status_code: 500});
  	})
  }, function(message_error) {
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
};

Meeting_Services.reserve_room = function(reserve, user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data: "Not found user", status_code: 400, status: "error"});
    }

    // convert array list user_code -> array list object
    var users = [];
    for(var i = 0; i < reserve.user_invited.length; i++) {
      users.push({"user_code": reserve.user_invited[i]});
    }
    reserve.user_invited = users;

    // reserve room
  	room_service.reserve_room(reserve, message.data, global.schedule_service, function(error, result) {
      if(!error) {
        return callback(false, {data: result, status_code: 500, status: "error"});
      }
      return callback(true, {data: result, status_code: 201, status: "success"});
    });
  }, function(message_error) {
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  });
};

Meeting_Services.create_room = function(list_user, user_code, callback) {
  user_helper.find_by_code(user_code)
  .then(function(message) {
    if(message.data === null) {
      return callback(true, {data: "Not found user", status_code: 400, status: "error"});
    }
    user_helper.find_list_user_id(list_user)
    .then(function(mes) {
      if(mes.data === null || mes.data.length < list_user.length) {
        return callback(true, {data: "Not found user in system, list_user's falied", status_code: 400, status: "error"});
      }
      room_service.create_room(list_user, message.data, function(error, result) {
        if(!error) {
          return callback(false, {data: result, status_code: 500, status: "error"});
        }
        return callback(true, {data: result, status_code: 201, status: "success"});
      });
    }, function(mes_error) {
      return callback(false, {data: mes_error.error, status_code: 500, status: "error"});
    });
  }, function(message_error) {
    return callback(false, {data: message_error.error, status_code: 500, status: "error"});
  })
};

Meeting_Services.get_all_schedule = function(callback) {
  reservation_helper.get_all_schedule()
  .then(function(message) {
    return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

Meeting_Services.get_all_meeting = function(callback) {
  reservation_helper.get_all_reserve()
  .then(function(message) {
    return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

Meeting_Services.get_all_previous = function(callback) {
  reservation_helper.get_all_reserve_previous()
  .then(function(message) {
    return callback(true, {message: "", data: message.data, status_code: 200, status: "success"});
  }, function(message_error) {
    return callback(false, {message: message_error.error, data: {}, status_code: 500, status: "error"});
  });
};

module.exports = Meeting_Services;
