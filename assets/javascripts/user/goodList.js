$(window).load(function() {
  var $selects = $('select.form-control');
  var $selectDptId = $('select[name=dptId]');
  var $selectDptSubId = $('select[name=dptSubId]');
  var $dpts = $selectDptId.data("dpts");

  $selects.map(function(index,select) {
    var $select = $(select);
    $select.val($select.data('value'));
  });
  $selectDptId.change(function() {
    $selectDptSubId.html('');
    $dpts[this.value-1].DptSubs.map(function(dptSub, index) {
      $selectDptSubId.append("<option value="+ dptSub.id +">"+ dptSub.name +"</option>");
    });
  });
});
