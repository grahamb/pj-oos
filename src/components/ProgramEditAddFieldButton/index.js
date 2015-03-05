var $ = require('jquery');
$('#prerequisites_knowledge_skills_equipment').off().on('click', 'button', function(e) {
  var $this = $(this);
  var field = $this.data('field');
  var html = '<input type="text" name="' + field + '" value="">';
  $this.prev().after(html);
  $this.prev().focus();
});