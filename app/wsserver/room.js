function Room(type, host, room_code, limited) {
  var self = this;

  self.type = type;
  self.host = host;
  self.room_code = room_code;
  self.limited = limited;
  self.users = [];
};

module.exports = Room;
