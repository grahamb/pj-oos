var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));
var Promise = require('sequelize').Promise;
var fs = Promise.promisifyAll(require('fs'));
sendgrid = sendgrid.promisifyAll(sendgrid);

var send_email = function(message, payload, callback) {
    fs.readFile('./lib/email/messages/' + message, {encoding:'utf8'}, function(err, text) {
        if (err) {
            console.log(err);
            callback(err, null);
            return false;
        }
        payload.text = text;
        sendgrid.send(payload, function(err, result) {
            if (err) {
                console.log(err);
                callback(err, null);
                return false;
            }
            callback(null, result);
        });
    });
}