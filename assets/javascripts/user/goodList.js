$selects = $('select.form-control');
$selects.map(function(index,select) {
  var $select = $(select);
  $select.val($select.data('value'));
});
