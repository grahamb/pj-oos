var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));

var production = 'production' === process.env['NODE_ENV'];

var sendgridDelivery = function(tokenToSend, uidToSend, recipient, callback) {
  var host = config.get('server.hostname');
  var payload = {
    fromname: config.get('email.fromname'),
    from: config.get('email.from'),
    to: production ? recipient : 'hello+pjprogram_development@grahamballantyne.com',
    subject: 'PJ 2015 Program Selection Login Information',
    text: 'Welcome to PJ 2015!\n\nWe received a request for ' + recipient + ' to log into http://program.pj2015.ca.\n\n To log in, click here: http://' + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend) + '\n\nThis link will expire in one hour.\n\nIf not, please ignore this email.'
  };
  // console.log('***** sendgridDelivery');
  // console.log(arguments);
  // console.log(callback.toString());
  // return callback(null, {tokenToSend: tokenToSend});
  sendgrid.send(payload, function(err, json) {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    callback(null, json);
  });
}

module.exports = sendgridDelivery;