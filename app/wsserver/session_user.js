
var SessionUser = {
  list_user: [],
  get_users: function() {
    return this.list_user;
  },
  edit_user: function(user_name, socket_id) {
    for(var i = 0; i < this.list_user.length; i++) {
      if(user_name === this.list_user[i].user_name) {
        this.list_user[i].socket_id = socket_id;
        break;
      }
    }
  },
  change_status: function(user_name, status) {
    for(var i = 0; i < this.list_user.length; i++) {
      if(user_name === this.list_user[i].user_name) {
        this.list_user[i].status = status;
        break;
      }
    }
  },
  update_list_user: function(list) {
    this.list_user = list;
  },
  remove_user: function(socket_id, wsocket) {
    for(var i = 0; i < this.list_user.length; i++) {
      if(this.list_user[i].socket_id === socket_id) {
        this.list_user.splice(i, 1);
        wsocket.broadcast.emit('list_user', this.list_user);
        break;
      }
    }
  },
  find_user: function(user_name) {
    for(var i = 0; i < this.list_user.length; i++) {
      if(user_name === this.list_user[i].user_name) {
        return this.list_user[i];
      }
    }
    return null;
  }
};

module.exports = SessionUser;
