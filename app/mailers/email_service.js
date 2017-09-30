var mailer      = require('nodemailer');
var mail_config = require('../../config/mailconfig.js')();
var moment      = require('moment');

var EmailService = {
  send_invite: function(room, user, path_room, callback) {
    var smtp_transport = mailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: mail_config.email_src,
        pass: mail_config.pass
      }
    });

    var content = "";
    content += "<h3>Thư mời họp</h3>\n" +
               "<p>Xin chào " + user.first_name + " " + user.last_name + ",</p>\n" +
               "<p>Người tạo phòng họp: " + room.room_master.first_name + " " + room.room_master.last_name + " - " + room.room_master.user_name + "</p>\n" +
               "<p>Thời gian bắt đầu: <b>" + moment(room.started_at).format('llll') + "</b></p>\n" +
               "<br><hr>\n" +
               "<p>Xin mời click vào đường link sau để vào phòng họp. Link phòng họp: <a href='"+ path_room + "'><b>" + path_room + "</b></a></p>\n" +
               "<br>\n" +
               this.get_users(room.user_invited);


    var mail_options = {
      from: mail_config.author + ' ' + mail_config.email_src,
      to: user.email,
      subject: mail_config.subject,
      html: content
    };

    smtp_transport.sendMail(mail_options, function(error, info) {
      if(error) {
        smtp_transport.close();
        return callback(error, error);
      }
      else {
        smtp_transport.close();
        return callback(null, info.message);
      }
    });
  },
  get_users: function(users) {
    var content = "";
    content += "<p>Danh sách người trong phòng họp</p>\n";
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      var index = i + 1;
      content += "<p>" + index + ". " + user.first_name + " " + user.last_name + " - " + user.user_name + "</p>\n";
    }
    return content;
  }
};

module.exports = EmailService;
