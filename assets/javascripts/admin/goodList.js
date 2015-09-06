$(window).load(function() {
  var $selects = $('select.form-control');
  var $selectDptId = $('select[name=dptId]');
  var $selectDptSubId = $('select[name=dptSubId]');
  var $dpts = $selectDptId.data("dpts");
  // 小館別對應大館別選擇
  $selects.map(function(index,select) {
    var $select = $(select);
    $select.val($select.data('value'));
  });
  $selectDptId.change(function() {
    $selectDptSubId.html('');
    $selectDptSubId.append("<option value='-1'>所有館別</option>");
    $dpts[this.value-1].DptSubs.map(function(dptSub, index) {
      $selectDptSubId.append("<option value="+ dptSub.id +">"+ dptSub.name +"</option>");
    });
  });
});
