'use strict';

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
        if (role.can(action)) {
            return options.fn(this);
        }
    }
}