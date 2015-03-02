if (__PRODUCTION__) {
  require('./ga');
}
require('Navbar')();
if (!__PRODUCTION__) { console.log('this is not production'); }