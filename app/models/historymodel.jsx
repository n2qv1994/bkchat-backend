// History Model 

function HistoryModel(connection) {
  var self = this;
  this.connection = connection;
};

// 
HistoryModel.prototype.showUserHistory = function(userId, callback) {
  var self = this;
  var query = "SELECT username, Room.* " + 
              "FROM User, User_has_Room, Room " +
              "WHERE User.userid = User_has_Room.userid " +
              "AND User_has_Room.roomid = Room.roomid " + 
              "And User.userid = ?";

  self.connection.query(query, userId, function(err, rows) {
    if(err) {
      self.connection.end();
      return callback(true, err);
    }
    self.connection.end();
    return callback(false, rows);
  });
};

HistoryModel.prototype.showRecentHistory = function(userId, callback) {
  var self = this;
  var query = "SELECT username, Room.* " + 
              "FROM User, User_has_Room, Room " +
              "WHERE User.userid = User_has_Room.userid " +
              "AND User_has_Room.roomid = Room.roomid " + 
              "And User.userid = ? order by roomid desc limit 8";

              
  self.connection.query(query, userId, function(err, rows) {
    if(err) {
      self.connection.end();
      return callback(true, err);
    }
    self.connection.end();
    return callback(false, rows);
  });
};

HistoryModel.prototype.deleteHistory = function(roomId, callback) {
  var self = this;
  var query = "DELETE FROM User_has_Room WHERE roomid = ?";

  self.connection.query(query, roomId, function(err, rows) {
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
    return callback(false, "delete successfully"); 
  });
};

module.exports = HistoryModel;
