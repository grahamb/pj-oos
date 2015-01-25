var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));

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

module.exports = send_email;


models.OOS.findAll({ where: { import_id: 3 }, include: [ { model: models.Program, where: {id: 0} } ] }).then(function(results) {
    results.forEach(function(record) {
        send_email('oos_welcome', {
            to: record.email,
            from: 'hello@grahamballantyne.com',
            formname: 'Graham Ballantyne',
            subject: 'PJ 2015 Program Offer of Service Assignment (' + record.first_name + ' ' + record.last_name + ' - OOS #' + record.oos_number + ')'
        }, function(err, result) {
            console.log(arguments);
        });
    });
});