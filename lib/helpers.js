'use strict';
var handlebars_helpers = require('handlebars-helpers');
var moment = require('moment');
var helpers = handlebars_helpers();

helpers.selected = function(option, value) {
  return option === value ? 'selected' : '';
};

helpers.whatis = function(value) {
  console.dir(value);
};

helpers.starred_activity = function(program, badge) {

  if (program.premium_activity === false) {
    return '';
  }

  var star_icon = '<i class="fa fa-star"></i>';
  if (badge === false) {
    return star_icon;
  }

  return '<div class="premium_activity_badge"><span class="badge" style="float:right">' + star_icon + '</span></div>';
};

helpers.list_or_none = function(context) {
  var arr = [];
  context = context || [];
  context.forEach(function(item) {
    arr.push('<li>' + item + '</li>');
  });
  return arr.length ? arr.join('') : '<li>None</li>';
};

helpers.user_can = function(action, options) {
  var role = options.data.root.role;
  return role.can(action) ? options.fn(this) : options.inverse(this);
};

helpers.user_is = function(roles, options) {
  var role = options.data.root.role;
  roles = roles.split(',').map(function(role) { return role.trim() });
  return role.isAny(roles) ? options.fn(this) : options.inverse(this);
};

helpers.percent = function(left_side, right_side, precision) {
  var perc = left_side / right_side;
  return (perc * 100).toFixed(precision)  + '%';
};

helpers.pal_icon = function(oos_number, pal_id) {
  return oos_number === pal_id ? '<span class="pal">PAL</span>' : '';
};

helpers.format_date = function(fmt, date) {
  if (!date) { date = new Date(); }
  return moment(date).format(fmt);
};

helpers.format_time_string = function(fmt, time) {
  time = time.split(':');
  var date = moment({ hour: time[0], minute: time[1], seconds: time[2] });
  return date.format(fmt);
};

helpers.json = function(data) {
  return JSON.stringify(data, null, 2);
};

helpers.locked_icon = function(data) {
  return data ? '<i class="fa fa-lock"></i>' : '<i class="fa fa-unlock-alt"></i>';
};

helpers.humanized_period = function(period) {
  switch (period.spans_periods) {
    case 3:
      return 'All Day + ' + moment(period.end_at).format('dddd') + ' Morning';
      break;
    case 2:
      return 'All Day';
      break;
    case 1:
      if (moment(period.start_at).hour() < 12) {
        return 'Morning';
      } else {
        return 'Afternoon';
      }
      break;
  }
};

helpers.join = function(arr, delim) {
  return arr.join(delim);
};


module.exports = helpers;
