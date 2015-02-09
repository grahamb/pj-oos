var config = require('config');
var sendgrid  = require('sendgrid')(config.get('email.username'), config.get('email.password'));
var fs = require('fs');
var models = require('../../models');
var OOS = models.OOS, Program = models.Program;
var hbs = require('express-handlebars');
var handlebars = new hbs.ExpressHandlebars();
var moment = require('moment');
var htmlToText = require('html-to-text');

var send_email = function(payload, callback) {
    sendgrid.send(payload, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
            return false;
        }
        callback(null, result);
    });
}

var send_welcome_email = function(oos, production, callback) {
    console.log('production', production);
    Program.findAll({
        where: {
            hidden: false,
            include_in_welcome_email: true
        },
        include: [{model: OOS, as: 'OOS'}]
    }).then(function(programs) {
        programs.forEach(function(program, index, array) {
            if (program.OOS.length >= program.oos_required) {
                programs.splice(index, 1);
            }
        });

        // programs now contains only programs that are available for selection
        handlebars.render('./lib/email/messages/oos_welcome.hbs', {due_date: moment().add(10, 'd').format('dddd, MMMM D'), programs: programs}).then(function(template) {
            var payload = {
                to: production ? oos.email : 'hello+pjprogram_development@grahamballantyne.com',
                from: 'hello+pjprogram@grahamballantyne.com',
                bcc: ['hello+pjprogram@grahamballantyne.com'],
                from_name: 'Graham Ballantyne (PJ 2015)',
                subject: 'PJ 2015 Program Offer of Service Assignment (' + oos.first_name + ' ' + oos.last_name + ' - OOS #' + oos.oos_number + ')',
                text: htmlToText.fromString(template, {wordwrap: 180}),
                html: template
            };
            send_email(payload, callback);
        }).catch(console.error);
    });
}


module.exports = {
    welcome: send_welcome_email
};
