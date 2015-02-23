var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('program_selection/index');

  /*
    If user.is['unit leader']
      - find the user's unit
      - find the program selection for the unit
      - find all programs:
        - if program selection exists, find with $or, passing int he selection array
          https://sequelize.readthedocs.org/en/latest/docs/models/#manipulating-the-dataset-with-limit-offset-order-and-group
        - if no selection exists, just find all programs, maybe randomize it? https://github.com/coolaj86/knuth-shuffle
      - render the selection view

    If user.isAny['admin', 'program hq']
      - render an index view of all program selections
  */

});

router.get('/:id', role.isAny(['admin', 'hq staff']), function(req, res) {
  /*
    - find the program selection, include program model
    - render template
   */
});

router.get('/:id/edit', role.isAny(['admin', 'hq staff']), function(req, res) {
  /*
    - find the program selection
    - render the same template as '/' for unit leader
   */
});

router.post('/:id', role.isAny(['admin', 'hq staff', 'unit leader']), function(req, res) {
  /*
    need to make sure that if the user's role is 'unit leader', they can only POST to their own program selection
   */
});

module.exports = router;
