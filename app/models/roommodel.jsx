// Room Model

function RoomModel(connection) {
	var self = this;
/*	this.roomId = roomId;
	this.roomName = roomName;
	this.roomMaster = roomMaster;
	this.description = description;
	this.limit = limit;
	this.lock = lock;
	this.create_at = create_at;
	this.status = status;*/
	this.connection = connection;
}

RoomModel.prototype.createRoom = function(room, callback) {
	var self = this;
	var query = "INSERT INTO Room SET ?";
	var queryRoomName = "SELECT * FROM Room WHERE room_name = ? AND status = 'wait' " + 
											"UNION " + 
											"SELECT * FROM Room WHERE room_name = ? AND status = 'end'";
	var queryCheck = "SELECT * FROM User WHERE username = ?";
	var queryJoin = "INSERT INTO User_has_Room SET ?";
	var result = null;
	var new_room = {
		room_name: room.roomName,
		room_master: room.roomMaster,
		description: room.description,
		limit: room.limit,
		create_at: room.create_at,
		end_at: "",
		status: room.status
	};

	if(room.limit === '') {
		new_room.limit = 5;
	}

	self.connection.query(queryCheck, room.roomMaster, function(error,rows){
		if(error) {
			return self.connection.rollback(function() {
        throw error;
      });
      self.connection.end();
			return callback(true,error);
		}
		var status = rows[0].status;
		if(status == 'online') {
			var userid = rows[0].userid;
			self.connection.query(queryRoomName, [room.roomName, room.roomName], function(err,rows) {
				if(err) {
					return self.connection.rollback(function() {
		        throw err;
		      });
		      self.connection.end();
					return callback(true, err);
				}
				self.connection.commit(function(err) {
	        if (err) {
	          return self.connection.rollback(function() {
	            throw err;
	          });
	          self.connection.end();
	        }
	      });
				if(rows.length == 0) {
					self.connection.query(query, new_room, function(err,rows) {
						if(err) {
							return self.connection.rollback(function() {
				        throw err;
				      });
				      self.connection.end();
							return callback(true, err);
						}
						self.connection.commit(function(err) {
			        if (err) {
			          return self.connection.rollback(function() {
			            throw err;
			          });
			          self.connection.end();
			        }
			      });
						var data = {
							userid: userid,
							roomid: rows.insertId
						};
						self.connection.query(queryJoin, data, function(err, rows) {
							if(err) {
								return self.connection.rollback(function() {
					        throw err;
					      });
					      self.connection.end();
							}
							self.connection.commit(function(err) {
				        if (err) {
				          return self.connection.rollback(function() {
				            throw err;
				          });
				          self.connection.end();
				        }
				        console.log('success!');
				      });
				      self.connection.end();
							result = "success";
							return callback(false, result);
						});
					});
				}
				else {
					result = "room's existed ";
					return callback(true, result);
				}
			});
		}
		else{
			result = "you must login";
			return callback(true, result);
		}
	});	
};


RoomModel.prototype.updateEndTime = function(roomname, end_at, callback) {
	var self = this;
	var queryroom = "SELECT roomid FROM Room WHERE room_name = ? AND status = 'live'";
	var query = "UPDATE Room SET end_at = ?, status = 'end' WHERE roomid = ?";

	self.connection.query(queryroom, [roomname], function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		if(rows.length > 0) {
			var roomid = rows[0].roomid;
			self.connection.query(query, [end_at, roomid], function(err, rows) {
				if(err) {
					return self.connection.rollback(function() {
		        throw err;
		      });
		      self.connection.end();
				}

				self.connection.commit(function(err) {
	        if (err) {
	          return self.connection.rollback(function() {
	            throw err;
	          });
	          self.connection.end();
	        }
	        console.log('update success!');
	      });
				self.connection.end();
	      return callback(false, "update success");
			});
		}
	});
};

/* dung bang user, user_has_room, room
*  userName de lay userId
*  userId, roomId luu vao user_has_room
*/
RoomModel.prototype.joinName = function(username, roomid, callback) {

	var self = this;
	var queryUser = "SELECT * FROM user WHERE username = ?";
	var result = '';
	self.connection.query(queryCheck,username, function(error,rows) {
		if(error) {
			self.connection.end();
			return callback(true,null);
		}
		if(rows[0].status == 'online'){
			self.connection.query(queryUser, username , function(err,rows) {
				if(err) {
					self.connection.end();
					return callback(true, null);
				}
				
				var queryJoin = "INSERT INTO User_has_Room SET ?";
				var uhs = {
					userid:rows[0].userid,
					roomid:roomid
				}	
				self.connection.query(queryJoin, uhs , function(err,rows) {
					if(err) {
						self.connection.end();
						return callback(true, null);
					}	
					self.connection.end();
					result = rows[0];
					return callback(false, result);
				});
			});
		}
		else{
			self.connection.end();
			result = "you must login";
			return callback(false,result);
		}
	});
};
// lock,limit. roomid,roommaster co dinh.
RoomModel.prototype.updateInfoRoom = function(roomName,info,value,callback) {
	var self = this;

	var query = "UPDATE room SET " + info + " = ? WHERE room_name = ?";
	self.connection.query(query, [value,roomName] , function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
			throw err;
		}	
		self.connection.end();
		var result = "update " +info+" successful ";
		return 	callback(false, result);
	});

};

RoomModel.prototype.deleteRoom = function(roomId, callback) {
	var self = this;
	var queryRoom = "DELETE FROM room WHERE roomid = ?";
	var queryUHS = "DELETE FROM user_has_room WHERE roomid = ?";
		self.connection.query(queryUHS, roomId , function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
			throw err;
		}
		self.connection.query(queryRoom, roomId , function(err,rows){
			if(err) {
				self.connection.end();
				return callback(true, null);
				throw err;
			}	
			self.connection.end();
			var result = "delete successful";
			return callback(false, result);
		});
	});
};


RoomModel.prototype.findRoomName = function(roomName, callback) {
	var self = this;
	var query = "SELECT * FROM Room WHERE room_name = ?";
	self.connection.query(query, roomName , function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, err);
		}	
		self.connection.end();
		var result = rows[0];
		return callback(false, result);
	});
};

RoomModel.prototype.findRoomInvalid = function(roomName, callback) {
	var self = this;
	var query = "SELECT * FROM Room WHERE room_name = ? AND status = 'wait' " + 
							"UNION " + 
							"SELECT * FROM Room WHERE room_name = ? AND status = 'end'";

	self.connection.query(query, [roomName, roomName], function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		self.connection.end();
		return callback(false, rows);
	});
};

RoomModel.prototype.findRoomWithUser = function(username, callback) {
	var self = this;
	var queryUser = "SELECT * FROM user WHERE username = ?";

	self.connection.query(queryUser, username , function(err,rows) {
		console.log(rows[0].userid);
		if(err) {
			self.connection.end();
			return callback(true, null);
			throw err;
		}
		if(!err) {
			var queryIdRoom ="SELECT * FROM user_has_room WHERE userid = ?";
			self.connection.query(queryIdRoom, rows[0].userid , function(err,rows){
				console.log(rows[0].roomid);
				if(err) {
					self.connection.end();
					return callback(true, null);
					throw err;
				}	
				if(!err){
					var queryRoom ="SELECT * FROM room WHERE roomid = ?";
					self.connection.query(queryRoom, rows[0].roomid , function(err,rows){
						if(err) {
							self.connection.end();
							return callback(true, null);
							throw err;
						}
						self.connection.end();
						var result = rows[0];
						return callback(false, result);
					});	
				}
			});
		}
	});
};

RoomModel.prototype.checkLimit = function(roomId, callback) {

	var self = this;
	var query = "SELECT * FROM room WHERE roomid = ?";
	self.connection.query(query, roomId , function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
			throw err;
		}	
		var limit = rows[0].limit;
		if(!err) {
			var queryUserId = "SELECT * FROM user_has_room WHERE roomid = ?";			
			self.connection.query(queryUserId, roomId , function(err,rows){
				if(err) {
					self.connection.end();
					return callback(true, null);
					throw err;
				}	
				self.connection.end();
				var result = rows.length + "/" + limit +" member";
				return callback(false, result);
			});
		}
	});

};

RoomModel.prototype.listRoom = function(status, callback) {
	var self = this;
	var query = "SELECT * FROM Room WHERE status = ?";

	self.connection.query(query, status, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		self.connection.end();
		return callback(false, rows);
	});
};


// RoomModel.prototype.listRoom = function(code, callback) {

// 	var self = this;
// 	var queryID = "SELECT roomid FROM room ";

// 	self.connection.query(queryID, function(err,rows){
// 		if(err) {
// 			return callback(true, null);
// 			throw err;
// 		}
// 		console.log(rows[0]);
// 		console.log(rows.length);
		
// 		var queryRoom = "SELECT * FROM room WHERE roomid = ?";
// 		for(var i=0 ; i < rows.length ; i++){
// 			self.connection.query(queryRoom, [rows[i]] , function(err,rows){
// 				if(err) {
// 					return callback(true, null);
// 					throw err;
// 				}	
// 				var result = rows[i];
// 				return 	callback(false, result);
// 			});
// 		}
// 	});
// };

module.exports = RoomModel;
