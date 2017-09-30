// var RoomModel = require('../models/roommodel.js');
// var database = require('../db/connection.js');
// var dateFormat = require('dateformat');
// var UserModel = require('../models/usermodel.js');
var room_service = require('../services/room_services');

exports.ask_room = function(req, res) {
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
  room_service.ask_room(user, room_code, function(err, result) {
  	if(err) {
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

// exports.createRoom = function(req, res) {

// 	var username = req.body.username || '';
// 	var roomname = req.body.roomname || '';
// 	var description = req.body.description || '';
// 	var limit = req.body.limit || '';
// 	var lock = req.body.lock || '';

// 	if( roomname == '' || limit == ''|| lock == ''|| username == '') {
// 		return res.sendStatus(400);
// 	}
// 	var date = new Date();
// 	var time = date.getTime();
// 	var create_at= dateFormat(time, "yyyy-mm-dd h:MM:ss");
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.createRoom(username,roomname,description,limit,lock,create_at,function(error, result) {
// 		if(error) {
// 			return res.send(401);
// 		}
// 		res.json({messange:"create room successful"});
// 	});
// };

// exports.joinName = function(req, res) {


// 	var roomid = req.body.roomid || '';
// 	var username = req.body.username || '';

// 	if( roomid == '' || username == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.joinName(username,roomid,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"join Room false"});
// 		}
// 		res.json({messange:"join Room successful"});
// 	});
// };

// exports.deleteRoomm = function(req, res) {

// 	var roomid = req.body.roomid || '';

// 	if( roomid == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.deleteRoomm(roomid,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"delete Room false"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.checkLimit = function(req, res) {

// 	var roomid = req.body.roomid || '';

// 	if( roomid == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.checkLimit(roomid,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"check Limit false"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.findRoomName = function(req, res) {

// 	var roomname = req.body.roomname || '';

// 	if( roomname == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.findRoomName(roomname,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"find room name false"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.updateInfoRoom = function(req, res) {

// 	var roomname = req.body.roomname || '';
// 	var info = req.body.info || '';
// 	var value = req.body.value || '';

// 	if( roomname == ''|| info == ''|| value == '') {
// 		req.send(500);
// 	}
// 	if(info=="lock"||info=="limit"||info=="roomid"||info=="roommaster"){
// 		mess = "you can't update " + info;
// 		return res.json({messange:mess});
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.updateInfoRoom(roomname,info,value,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"update info false"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.findRoomWithUser = function(req, res) {

// 	var username = req.body.username || '';

// 	if( username == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.findRoomWithUser(username,function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({messange:"find room with username false"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.listRoom = function(req, res) {


// 	var code = req.body.code || '';

// 	if( code != '1802') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	roomModel = new RoomModel(connection);
// 	roomModel.listRoom(code,function(error, result) {
// 		if(error) {
// 			res.sendStatus(401);
// 			return res.json({messange:"can't show list Room"});
// 		}
// 		res.json({data: result});
// 	});
// };

// exports.inviteUsers = function(req, res) {
// 	var users = req.body.users || '';
// 	var url = req.body.url || '';
// 	if(users === '' || url === '') {
// 		return res.sendStatus(401);
// 	}
// 	// kiem tra list user gui len
// 	var connection = database.connect();
// 	userModel = new UserModel(connection);
// 	userModel.getMultiUsers(users, function(err, result) {
// 		if(err) {
// 			return res.sendStatus(401);
// 		}
// 		else {
// 			for(var i = 0; i < users.length; i++) {

// 			}
// 		}

// 	});
	
// };
