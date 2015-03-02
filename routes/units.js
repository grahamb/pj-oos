var express = require('express');
var router = express.Router();
var models = require('../models');
var Unit = models.Unit, ProgramSelection = models.ProgramSelection;
var Promise = require('sequelize').Promise;
var role = require('connect-acl')(require('../lib/roles'));
var email = require('../lib/email');

var program_selection_status_icon_helper = function(selection) {
    console.log(selection);
    var tmpl = '<i class="fa fa-ICON" title="TITLE"></i>';
    var icons = {
        locked: { icon: 'lock', title: 'Locked' },
        unlocked: { icon: 'unlock-alt', title: 'Not Locked'},
        not_started: { icon: 'minus', title: 'Not Started' }
    };
    var icon;

    if (!selection.program_selection.length) {
        icon = icons.not_started
    } else if (selection.locked) {
        icon = icons.locked;
    } else {
        icon = icons.unlocked
    }

    return tmpl.replace('ICON', icon.icon).replace('TITLE', icon.title);
}


router.get('/', role.can('view unit'), function(req, res) {
    Unit.findAll({
        include: [ProgramSelection]
    }).then(function(units) {
        res.render('units/index', {
            units: units,
            title: '- Unit Listing',
            helpers: {
                program_selection_status_icon_helper: program_selection_status_icon_helper
            }
        });
    }).catch(function(error) {
        console.log(error);
        res.status(500).end();
    });
});

router.get('/:id', role.can('view unit'), function(req, res) {
    // Show Specific Unit
});

router.post('/:id', role.can('edit unit'), function(req, res) {
    // Update Specific Unit
});

router.get('/:id/edit', role.can('edit unit'), function(req, res) {
    // Edit Specific Unit
});

module.exports = router;