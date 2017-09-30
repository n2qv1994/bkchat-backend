/**
 * Author: Nguyen Hoang Anh
 * Helper: scheduler
 */

var room_helper        = require('../helpers/room_helper');
var reservation_helper = require('../helpers/reservation_helper');
var notification_helper = require('../helpers/notification_helper');
var uuid               = require('node-uuid');
var utils              = require('../utils/utils');
var moment             = require('moment-timezone');
var cron               = require('node-schedule');
var env                = process.env.NODE_ENV || 'development';
var config             = require(__dirname + '/../../config/config.json')[env];

function ScheduleService() {
  var self       = this;
  this.schedules = [];
  this.week      = [];

  self.init(function(err, result) {
    if(!err) {
      utils.error_log(result);
    }
    for(var i = 0; i < result.length; i++) {
      var schedule = {
        user: {
          id: result[i].id,
          user_name: result[i].user_name
        },
        room_name:  result[i].room_name,
        room_code:  result[i].room_code,
        reverse_id: result[i].reverse_id,
        started_at: result[i].started_at,
        invitation: result[i].users
      };
      self.schedules.push(schedule);
    }

    self.init_check_schedule();
    self.get_schedule_in_week();
    // console.log(self.week);
    // for(var i = 0; i < self.week.length; i++) {
    //   console.log(self.week[i].room_name);
    //   for(var j = 0; j < self.week[i].invitation.length; j++) {
    //     console.log(self.week[i].invitation[j]);
    //   }
    // }
  });
}

ScheduleService.prototype.check_schedule = function() {
  var self = this;

  cron.scheduleJob({ second: new cron.Range(0, 59) }, function() {
    var current_time = moment.tz(config.zone).valueOf();
    // console.log(self.week);
    if(self.week.length === 0) {
      self.get_schedule_in_week();
    }

    var week = self.week.slice();
    for(var i = 0; i < week.length; i++) {
      var schedule = week[i];
      var time_schedule = moment(schedule.started_at).tz(config.zone).valueOf();
      if((current_time - time_schedule) >= 0) {
        utils.message_log('Running system scheduler.');
        self.week.splice(i, 1);
        self.update_schedule(schedule, function(error, result) {
          if(!error) {
            utils.error_log(result);
          }
          utils.message_log(result);
          // Insert Notification
          for(var i = 0; i < schedule.invitation.length; i++) {
            var notify = {
              notice_code: uuid.v1(),
              notice_by: schedule.user.id,
              name: schedule.user.user_name,
              notice_image: "images/system.png",
              notice_room: schedule.room_code,
              notice_type: "system",
              notice_body: "Meeting room: " + schedule.room_name + " is upcomming",
              send_at: moment.tz(config.zone).utc().toDate().toString(),
              readed: 0,
              user_id: schedule.invitation[i].user_id
            };

            notification_helper.create(notify)
            .then(function(message) {
              Utils.message_log("Insert Notify successfully");
            }, function(message_error) {
              Utils.error_log(message_error.error);
            });
          }
          // global.events.emit('schedule', schedule);
        });
      }
    }
  });
};

ScheduleService.prototype.set_schedule = function(schedule) {
  var self = this;

  var current_time  = moment.tz(config.zone).valueOf();
  var time_schedule = moment(schedule.started_at).tz(config.zone).valueOf();
  if((current_time - time_schedule) >= 0) {
    self.update_schedule(schedule, function(error, result) {
      if(!error) {
        utils.error_log(result);
      }
      // Insert Notification
      for(var i = 0; i < schedule.invitation.length; i++) {
        var notify = {
          notice_code: uuid.v1(),
          notice_by: schedule.user.id,
          name: schedule.user.user_name,
          notice_image: "images/system.png",
          notice_room: schedule.room_code,
          notice_type: "system",
          notice_body: "Meeting room: " + schedule.room_name + " is upcomming",
          send_at: moment.tz(config.zone).utc().toDate().toString(),
          readed: 0,
          user_id: schedule.invitation[i].user_id
        };

        notification_helper.create(notify)
        .then(function(message) {
          Utils.message_log("Insert Notify successfully");
        }, function(message_error) {
          Utils.error_log(message_error.error);
        });
      }
      utils.message_log(result);
    });
  }
  else {
    var last_day = moment(new Date(moment.tz('Asia/Ho_Chi_Minh').valueOf())).endOf('isoWeek').valueOf();
    var time_schedule = moment(schedule.started_at).tz(config.zone).valueOf();

    if((last_day - time_schedule) >= 0) {
      self.week.push(schedule);
    }
    else {
      self.schedules.push(schedule);
    }
  }
};

ScheduleService.prototype.update_schedule = function(schedule, callback) {
  var self = this;

  room_helper.update_room_status(schedule.room_code, 1)
  .then(function(message) {
    reservation_helper.update_status(schedule.reverse_id, 1)
    .then(function(message) {
      return callback(true, message.data);
    }, function(error) {
      return callback(false, message_error.error);
    });
  }, function(message_error) {
    return callback(false, message_error.error);
  });

};

ScheduleService.prototype.init = function(callback) {
  var self = this;

  reservation_helper.get_all_schedule_system().
  then(function(message) {
    return callback(true, message.data);
  }, function(message_error) {
    return callback(false, message_error.error);
  });
};

ScheduleService.prototype.get_schedule_in_week = function() {
  var self = this;

  var first_day  = moment(new Date(moment.tz('Asia/Ho_Chi_Minh').valueOf())).startOf('isoWeek').valueOf();
  var last_day   = moment(new Date(moment.tz('Asia/Ho_Chi_Minh').valueOf())).endOf('isoWeek').valueOf();

  var list_schedule = self.schedules.slice();
  for(var i = 0; i < list_schedule.length; i++) {
    var schedule = list_schedule[i];
    var time_schedule = moment(schedule.started_at).tz(config.zone).valueOf();
    // console.log(i + " - "+ schedule.room_name + " : " + time_schedule);
    debugger;
    if((last_day - time_schedule) >= 0) {
      self.week.push(schedule);
      self.schedules.splice(i, 1);
    }
  }
};

ScheduleService.prototype.init_check_schedule = function() {
  var self = this;

  var current_time = moment.tz(config.zone).valueOf();

  var schedules = self.schedules.slice();
  for(var i = 0; i < schedules.length; i++) {
    var schedule = schedules[i];
    var time_schedule = moment(schedule.started_at).tz(config.zone).valueOf();

    if((current_time - time_schedule) >= 0) {
      self.schedules.splice(i, 1);
      utils.message_log('Running system scheduler.');
      self.update_schedule(schedule, function(error, result) {
        if(!error) {
          utils.error_log(result);
        }
        // Insert Notification
        for(var i = 0; i < schedule.invitation.length; i++) {
          var notify = {
            notice_code: uuid.v1(),
            notice_by: schedule.user.id,
            name: schedule.user.user_name,
            notice_image: "images/system.png",
            notice_room: schedule.room_code,
            notice_type: "system",
            notice_body: "Meeting room: " + schedule.room_name + " is upcomming",
            send_at: moment.tz(config.zone).utc().toDate().toString(),
            readed: 0,
            user_id: schedule.invitation[i].user_id
          };

          notification_helper.create(notify)
          .then(function(message) {
            Utils.message_log("Insert Notify successfully");
          }, function(message_error) {
            Utils.error_log(message_error.error);
          });
        }
        utils.message_log(result);
      });
    }
  }
}

module.exports = ScheduleService;
