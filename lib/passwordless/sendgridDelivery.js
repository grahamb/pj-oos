var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));

var sendgridDelivery = function(tokenToSend, uidToSend, recipient, callback) {
    var host = 'localhost:3000';
    var payload = {
        fromname: config.get('email.fromname'),
        from: config.get('email.from'),
        to: recipient,
        subject: 'PJ 2015 Program Selection Login Information',
        text: 'Hello!\nAccess your account here: http://' + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend)
    };
    sendgrid.send(payload, function(err, json) {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        console.log(json);
        callback(null, json);
    });
}

module.exports = sendgridDelivery;