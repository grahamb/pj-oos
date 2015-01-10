'use strict';

var roles = {
    'anonymous': { can: ['view program'] },
    'unit leader': { can: ['view program', 'select program'] },
    'pal': { can: ['view program', 'edit program'] },
    'hq staff': { can: ['view program', 'edit program', 'view oos', 'edit oos'] },
    'admin': { can: ['view program', 'edit program', 'delete program', 'import programs', 'view oos', 'edit oos', 'delete oos', 'import oos', 'manage logins'] }
}

module.exports = roles;