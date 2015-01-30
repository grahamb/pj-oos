'use strict';
var handlebars_helpers = require('handlebars-helpers')();

module.exports = {
    selected: function(option, value) {
        return option === value ? 'selected' : '';
    },
    whatis: function(value) {
        console.dir(value);
    },
    starred_activity: function(program, badge) {

        if (program.premium_activity === false) {
            return '';
        }

        var star_icon = '<i class="fa fa-star"></i>';
        if (badge === false) {
            return star_icon;
        }

        return '<div class="premium_activity_badge"><span class="badge" style="float:right">' + star_icon + '</span></div>';
    },
    list_or_none: function(context) {
        var arr = [];
        context = context || [];
        context.forEach(function(item) {
            arr.push('<li>' + item + '</li>');
        });
        return arr.length ? arr.join('') : '<li>None</li>';
    },
    user_can: function(action, options) {
        var role = options.data.root.role;
        return role.can(action) ? options.fn(this) : options.inverse(this);
    },
    user_is: function(roles, options) {
        var role = options.data.root.role;
        roles = roles.split(',').map(function(role) { return role.trim() });
        return role.isAny(roles) ? options.fn(this) : options.inverse(this);
    },
    percent: function(left_side, right_side, precision) {
        console.log(precision);
        var perc = left_side / right_side;
        return (perc * 100).toFixed(precision)  + '%';
    },
    markdown: handlebars_helpers.markdown
}