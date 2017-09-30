var SessionRoom = {
  list_room: {},
  get_room: function(room_code) {
    return this.list_room[room_code];
  },
  check_room_exist: function(room_code) {
    var room = this.get_room(room_code);
    if(room === undefined) {
      return true;
    }
    return false;
  },
  add_room: function(room) {
    this.list_room[room.room_code] = room;
  },
  remove_room: function(room_code) {
    delete this.list_room[room_code];
  },
  add_user: function(room_code, room) {
    this.list_room[room_code].users = room.users;
  },
  leave_room: function(room_code, user_name) {
    var room = this.list_room[room_code];
    for(var i = 0; i < room.users.length; i++) {
      var user = room.users[i];
      if(user.user_name == user_name) {
        room.users.splice(i, 1);
        break;
      }
    }
  },
  check_room: function(room_code) {
    var num = this.list_room[room_code].users.length;
    if(num === 0) {
      return false;
    }
    return true;
  },
  send_message_broadcast: function(room_code, message, wsocket) {
    var room = this.list_room[room_code];
    for(var i = 0; i < room.users.length; i++) {
      var user = room.users[i];
      if(user.socket_id === wsocket.id) {
        continue;
      }
      else {
        wsocket.to(user.socket_id).emit("chat_room_broadcast", JSON.stringify({"status": true, "data": message}));
      }
    }
  },
  send_message: function(message, socket) {
    wsocket.to(message.to).emit("chat_user", JSON.stringify({"status": true, "data": message}));
  }
};

module.exports = SessionRoom;
