var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));
var fs = require('fs');
var models = require('../../models');
var OOS = models.OOS, Program = models.Program;
var handlebars = require('handlebars');
var moment = require('moment');
var htmlToText = require('html-to-text');

var send_email = function(payload, callback) {
    console.log(payload);
    sendgrid.send(payload, function(err, result) {
        console.log(err, result);
        if (err) {
            console.log(err);
            callback(err, null);
            return false;
        }
        callback(null, result);
    });
}

var send_welcome_email = function(oos, production, callback) {
    Program.findAll({
        where: {
            hidden: false,
            include_in_welcome_email: true
        },
        include: [{model: OOS, as: 'OOS'}]
    }).then(function(programs) {
        var available_programs = [];
        programs.forEach(function(program, index, array) {
            if (program.OOS.length < program.oos_required) {
                available_programs.push(program);
            }
        });

        fs.readFile('./lib/email/messages/oos_welcome.hbs', 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
                callback(err, null);
                return false;
            }
            var template = handlebars.compile(data);
            var html = template({due_date: moment().add(10, 'd').format('dddd, MMMM D'), programs: available_programs});
            var payload = {
                to: production ? oos.email : 'hello+pjprogram_development@grahamballantyne.com',
                from: 'hello+pjprogram@grahamballantyne.com',
                bcc: ['hello+pjprogram@grahamballantyne.com'],
                from_name: 'Graham Ballantyne (PJ 2015)',
                subject: 'PJ 2015 Program Offer of Service Assignment (' + oos.first_name + ' ' + oos.last_name + ' - OOS #' + oos.oos_number + ')',
                text: htmlToText.fromString(html, {wordwrap: 180}),
                html: html
            };
            send_email(payload, callback);
        });
    });
}

var send_assignment_email = function(oos, production, callback) {
    oos.Programs[0].getProgramActivityLeader().then(function(pal) {

        fs.readFile('./lib/email/messages/oos_assignment.hbs', 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
                callback(err, null);
                return false;
            }
            var template = handlebars.compile(data);
            var html = template({pal: pal, oos: oos});
            var payload = {
                to: production ? oos.email : 'hello+pjprogram_development@grahamballantyne.com',
                from: 'hello+pjprogram@grahamballantyne.com',
                bcc: ['hello+pjprogram@grahamballantyne.com'],
                from_name: 'Graham Ballantyne (PJ 2015)',
                subject: 'PJ 2015 Program Offer of Service Assignment (' + oos.first_name + ' ' + oos.last_name + ' - OOS #' + oos.oos_number + ')',
                text: htmlToText.fromString(html, {wordwrap: 180}),
                html: html
            };
            if (production && pal) {
                payload.cc = [pal.email];
            }
            send_email(payload, callback);
        });
    });
}

module.exports = {
    welcome: send_welcome_email,
    assignment: send_assignment_email
};
