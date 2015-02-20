var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('program_selection/index');
});

module.exports = router;
