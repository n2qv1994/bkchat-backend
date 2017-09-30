
function Email(from, to, subject, body, html) {
  var self = this;
  self.from = from;
  self.to = to;
  self.subject = subject;
  self.body = body;
  self.html = html;
}

module.exports = Email;
