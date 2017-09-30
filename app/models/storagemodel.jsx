// Storage Model
var mkdir = require('mkdirp');
var fs = require('fs');
var path = require('path');
var rmdir = require('rimraf');

function StorageModel(connection) {
	var self = this;
	this.connection = connection;
};

StorageModel.prototype.saveStorage = function(roomId, username, callback) {
 
 	var self = this;
 	var queryUser = "SELECT * FROM User WHERE username = ?";
 	var queryStorage = "INSERT INTO Storage SET ?"

 	self.connection.query(queryUser, username, function(err, rows) {
 		if(err) {
 			self.connection.end();
 			return callback(true, err);
 		}
 		var userid = rows[0].userid;
 		var storage = {
			create_at: new Date(),
			roomid: roomId,
			userid: userid
		};
		self.connection.query(queryStorage,storage,function(error,rows){
			if(error){
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
	    self.connection.end();
			return callback(false, rows.insertId);
		});
 	});
};

StorageModel.prototype.deleteVideo = function(roomid, callback) {
	var self = this;
	var queryRoom = "SELECT * FROM Storage WHERE roomid = ?";
	var query = "DELETE FROM Storage_details WHERE storageid = ?";

	self.connection.query(queryRoom, roomid, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}

		if(rows.length > 0) {
			storageid = rows[0].storageid;

			self.connection.query(query, storageid, function(err, result) {
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
		    self.connection.end();
				return callback(false, "success");
			});
		}
	});
};

StorageModel.prototype.deleteStorage = function(roomId, callback) {
	var self = this;
	var query = "DELETE FROM Storage WHERE roomid = ?";
	
	self.connection.query(query, roomId, function(err, result) {
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
    self.connection.end();
		return callback(false, "success");
	});
	
};

//delete forder user
StorageModel.prototype.clearStorage = function(userName,callback) {
	var dir = './storage/'+userName;
	rmdir(dir, function(error,result) {
			if(error) {
				return callback(true,null)
				throw error;
			}
			var result = "delete forder user "+ userName +" success";
			return callback(false,result);
	});

};

StorageModel.prototype.saveStorageDetail = function(videoname, storageid, callback) {
	var self = this;
	var query = "INSERT INTO Storage_details SET ?";

	var video = {
		videoname: videoname,
		storageid: storageid
	};

	self.connection.query(query, video, function(err, rows) {
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
    self.connection.end();
		var result = "success";
		return callback(false, result);
	});
};

// Show roomname, roommaster, thoigiantaoroom, thoigianketthucroom, thoigianluu,
StorageModel.prototype.showStorageDetail = function(number, listStorage, callback) {
	var self = this;
	var query = "SELECT * FROM Storage, Storage_details WHERE Storage.storageid = Storage_details.storageid " + 
	            "AND Storage.storageid = ?";

	self.connection.query(query, listStorage[number].storageid, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		self.connection.end();
		listStorage[number].details = rows;
		return callback(false, listStorage, number);
	}); 
};

StorageModel.prototype.showStorage = function(userid, callback) {
	var self = this;
	var query = "SELECT room_name, Storage.* FROM Storage, Room WHERE Storage.roomid = Room.roomid " +
	            "AND Storage.userid = ?";
	var list = [];

	self.connection.query(query, userid, function(err, rows) {
		if(err) {
			self.connection.end();
			return callback(true, err);
		}
		self.connection.end();
		if(rows.length > 0) {
			self.addStorage(rows, function(err, result) {
				if(err) {
					return callback(true, result);
				}
				return callback(false, result);
			});
		}
		else {
			return callback(false, rows);
		}
	}); 
};

StorageModel.prototype.addStorage = function(storage, callback) {
	var self = this;
	var list = [];
	for(var i = 0; i < storage.length; i++) {
		self.showStorageDetail(i, storage, function(err, data, number) {
			if(err) {
				return callback(true, err);
			}
			if(number == (data.length - 1)) {
				return callback(false, data);
			}				
		});
	}
};

module.exports = StorageModel;
