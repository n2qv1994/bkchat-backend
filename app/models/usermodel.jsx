// Model member 

function UserModel(connection){
	var self = this;
	this.connection = connection;
};

UserModel.prototype.getUsers = function(callback) {
	var self = this;
	var query = "SELECT userid, username, firstname, lastname, address, phone, email, status, avatar FROM User";
	self.connection.query(query, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, null);
		}
		self.connection.end();
		return callback(false, rows);
	});
};

UserModel.prototype.getUserByName = function(username, callback) {
	var self = this;	
	var query = "SELECT userid, username, firstname, lastname, status, avatar, address, phone, email FROM User WHERE username = ?";
	self.connection.query(query, [username], function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
		}	
		self.connection.end();
		var result = rows[0];
		return callback(false, result);
	});
};

UserModel.prototype.login = function(username, password, callback) {
	var self = this;	
	var query = "SELECT * FROM User WHERE username = ?";
	var queryStatus = "UPDATE User SET status = ? WHERE username = ?";
	self.connection.query(query, [username], function(err,rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		var user = rows[0];
	
		if(user === undefined || user === null || user === "") {
			return callback(true, null);
		}
		console.log(user);
		if(user.password == password) {
			self.connection.query(queryStatus, ['online',username] , function(error,rows) {
				if(error) {
					return self.connection.rollback(function() {
	          throw err;
	        });
	        self.connection.end();
					return callback(true, error);
				}	
				var result = {
					user: {"userid": user.userid, "username": user.username, "avatar": user.avatar, "role": user.roleid},
					success: true 
				};
				self.connection.end();
				return callback(false, result);
			});
		}
		else {
			return callback(true, "Login not successful");
		}
	});
};

UserModel.prototype.create = function (user, callback) {
	var new_user = {
		username : user.username,
		password : "123456",
		firstname : user.firstname,
		lastname : user.lastname,
		email : user.email,
		address : user.address,
		phone : user.phone,
		status: "offline",
		avatar: "",
		roleid: "2"
	};
	var query = "INSERT INTO User SET ?";
	var queryCheck = "SELECT * FROM User WHERE username = ?";
	var self = this;
	var result = "";

	self.connection.query(queryCheck, new_user.username, function(error, rows) {
		if(error) {
			self.connection.end();
			return callback(true, rows);
		}
		if(rows.length === 0) {
			self.connection.query(query, new_user, function(err, rows) {
				if(err) {
					self.connection.end();
					return callback(true, rows);
				}
				self.connection.end();	
				result = "success";
				return callback(false, result);
			});
		}
		else{
			self.connection.end();
			result = "exist";
			return callback(false, result);
		}
	});

};

UserModel.prototype.deleteUser = function(userId, callback) {
	var self = this;
	var queryRoom = "DELETE FROM User WHERE userid = ?";
	var queryUHS = "DELETE FROM User_has_Room WHERE userid = ?";
		self.connection.query(queryUHS, userId , function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
		}
		self.connection.query(queryRoom, userId , function(err,rows){
			if(err) {
				self.connection.end();
				return callback(true, null);
			}	
			self.connection.end();
			var result = "success";
			return callback(false, result);
		});
	});
};

UserModel.prototype.updateUser = function(user, callback) {
	var self = this;
	
	var query = "UPDATE User SET ? WHERE userid = ?";

	self.connection.query(query, [user, user.userid] , function(err,rows){
		if(err) {
			return self.connection.rollback(function() {
        throw err;
      });
      self.connection.end();
			return callback(true, rows);
		}	
		self.connection.end();
		return callback(false, "success");
	});	
};

UserModel.prototype.logout = function(username,callback){
	var self = this;	
	var query = "SELECT * FROM user WHERE username = ?";
	var queryStatus="UPDATE user SET status = ? WHERE username = ?";
	self.connection.query(query, username, function(err,rows){
		if(err) {
			self.connection.end();
			return callback(true, null);
			throw err;
		}
		if(!err){
 			self.connection.query(queryStatus, ['offline',username] , function(err,rows){
				if(err) {
					self.connection.end();
					return callback(true, null);
					throw err;
				}	
				self.connection.end();
				var result = "logout successful";
				return callback(false, result);
			});
		}
	});
};

UserModel.prototype.getMultiUsers = function(users, callback) {
	var self = this;
	var params = "(";
	for(var i = 0; i < users.length; i++) {
		if(i < users.length - 1) {
			params += users[i] + ",";
		}
		else {
			params += users[i] + ")";
		}
	}
	var query = "SELECT * FROM User WHERE userid in " + params;
	self.connection.query(query, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, null);
		}
		self.connection.end();
		return callback(false, rows);
	});
};

UserModel.prototype.updateStatus = function(username, status, callback) {
	var self = this;
	var query = "update User set status = ? where username = ?";
	self.connection.query(query, [status, username], function(err, rows) {
		if(err) {
			return self.connection.rollback(function() {
        throw error;
      });
      self.connection.end();
      return callback(true, null);
		}
		self.connection.commit(function(err) {
      if (err) {
        return self.connection.rollback(function() {
          throw err;
        });
      }
    });
    self.connection.end();
    return callback(false, true);
	});
};

UserModel.prototype.joinRoom = function(username, roomname, callback) {
	var self = this;
	var queryuser = "SELECT * FROM User WHERE username = ?";
	var queryroom = "SELECT * FROM Room WHERE room_name = ?";
	var query = "INSERT INTO User_has_Room SET ?";
	var querycheck = "SELECT * FROM User_has_Room WHERE userid = ? and roomid =?";

	self.connection.query(queryuser, username, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, null);
		}
		var userid = rows[0].userid;
		self.connection.query(queryroom, roomname, function(err, rows) {
			if(err) {
				self.connection.end();
				return callback(true, null);
			}
			var roomid = rows[0].roomid;
			var data = {
				userid: userid,
				roomid: roomid
			};
			self.connection.query(querycheck, [userid, roomid], function(err, rows) {
				if(err) {
					self.connection.end();
				}
				if(rows.length == 0) {
					self.connection.query(query, data, function(err, rows) {
						if(err) {
							return self.connection.rollback(function() {
				        throw err;
				      });
				      self.connection.end();
				      return callback(true, null);
						}
						self.connection.commit(function(err) {
			        if (err) {
			          return self.connection.rollback(function() {
			            throw err;
			          });
			        }
			        console.log('join success!');
			      });
			      self.connection.end();
			      return callback(false, "success");
					});
				}
				self.connection.end();
				return callback(false, "success");
			});
		});
	});
};

UserModel.prototype.getRoomInWeek = function(callback) {
	var self = this;
	var dt = new Date();

  dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  if(dt.getDay() > 1) { 
  	dt = new Date(dt.getTime() - (dt.getDay() > 0 ? (dt.getDay() - 1) * 1000 * 60 * 60 * 24 : 6 * 1000 * 60 * 60 * 24));
  }
  var start = dt;
  var end = new Date(dt.getTime() + 1000 * 60 * 60 * 24 * 7 - 1);

  var query = "SELECT * from Room WHERE create_at >= ? and create_at <= ?";
  
  self.connection.query(query, [start, end], function(err, rows) {
  	if(err) {
  		self.connection.end();
  		return callback(true, err);
  	}
  	self.connection.end();
  	return callback(false, rows);
  });
};

UserModel.prototype.getRoomInMonth = function(callback) {
	var self = this;
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	var query = "SELECT * from Room WHERE create_at >= ? and create_at <= ?";
  
  self.connection.query(query, [firstDay, lastDay], function(err, rows) {
  	if(err) {
  		self.connection.end();
  		return callback(true, err);
  	}
  	self.connection.end();
  	return callback(false, rows);
  });
};

UserModel.prototype.getRoomSchedule = function(username, callback) {
	var self = this;
	var query = "SELECT * FROM Room WHERE room_master = ?";

	self.connection.query(query, username, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		self.connection.end();
		return callback(false, rows);
	});
};

UserModel.prototype.endToConverstation = function(roomid, userName, callback) {
	var self = this;
	var date = new Date();
	var query = "UPDATE Room SET end_at = ?, status = 'end' WHERE roomid = ?";

	self.connection.query(query, [date, roomid], function(err, rows) {
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
		self.getRoomSchedule(userName, function(err, result) {
			if(err) {
				return callback(true, result);
			}
			return callback(false, result);
		});
	});
};

module.exports = UserModel;
