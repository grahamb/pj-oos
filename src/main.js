require('Navbar')();

if (__PRODUCTION__) {
  require('./ga');
} else {
  console.log("       d8b                         d8b                                                           \n       88P                         88P                                                     d8P   \n      d88                         d88                                                   d888888P \n  d888888   d8888b?88   d8P d8888b888   d8888b ?88,.d88b,  88bd8b,d88b  d8888b  88bd88b   ?88'   \n d8P' ?88  d8b_,dPd88  d8P'd8b_,dP?88  d8P' ?88`?88'  ?88  88P'`?8P'?8bd8b_,dP  88P' ?8b  88P    \n 88b  ,88b 88b    ?8b ,88' 88b     88b 88b  d88  88b  d8P d88  d88  88P88b     d88   88P  88b    \n `?88P'`88b`?888P'`?888P'  `?888P'  88b`?8888P'  888888P'd88' d88'  88b`?888P'd88'   88b  `?8b   \n                                                 88P'                                            \n                                                d88                                              \n                                                ?8P                                              \n")
}
