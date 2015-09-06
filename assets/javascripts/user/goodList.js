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
  
  $("#btnSave").click(function() {
    alert('clicked!');
    // var id = $(this).closest("tr").find(".nr").text();
    // $("#resultas").append(id);
    var table_data = [];
    $('tr').each(function(){
        var row_data = [];

        $('td', this).each(function(){
            row_data.push($(this).text());
        });
        table_data.push(row_data);

    });
    console.log(table_data);
  });

});
