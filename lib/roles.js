'use strict';

var roles = {
  'anonymous': { can: ['view program'] },
  'unit leader': { can: ['view program', 'select program', 'view schedule'] },
  'pal': { can: ['view program', 'edit program', 'view oos', 'view schedule'] },
  'hq staff': { can: ['view program', 'edit program', 'view oos', 'edit oos', 'view unit', 'edit unit', 'view schedule', 'edit schedule'] },
  'management team': { can: ['view program' , 'view schedule'] },
  'registrar': { can: ['view program', 'view oos', 'view schedule']},
  'admin': { can: ['view program', 'edit program', 'delete program', 'import programs', 'view oos', 'edit oos', 'delete oos', 'import oos', 'manage logins', 'view unit', 'edit unit', 'view schedule', 'edit schedule'] }
}

module.exports = roles;