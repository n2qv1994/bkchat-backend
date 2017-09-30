
var Utils = {
  error_log: function(message) {
    console.log("*** ERROR: - " + message);
  },
  message_log: function(message) {
    console.log("*** MESSAGE: - " + message);
  },
  set_format_date: function set_format_date(date_time) {
    var date = new Date(date_time);
    var result = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return result;
  }
};

module.exports = Utils;
