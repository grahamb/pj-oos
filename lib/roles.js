'use strict';

var roles = {
    'anonymous': { can: ['view program'] },
    'unit leader': { can: ['view program', 'select program'] },
    'pal': { can: ['view program', 'edit program', 'view oos'] },
    'hq staff': { can: ['view program', 'edit program', 'view oos', 'edit oos', 'view unit', 'edit unit'] },
    'management team': { can: ['view program' ] },
    'registrar': { can: ['view program', 'view oos']},
    'admin': { can: ['view program', 'edit program', 'delete program', 'import programs', 'view oos', 'edit oos', 'delete oos', 'import oos', 'manage logins', 'view unit', 'edit unit'] }
}

module.exports = roles;