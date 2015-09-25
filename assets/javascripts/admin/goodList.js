$(function() {
  var $selects = $('select.form-control');
  var $selectDptId = $('select[name=dptId]');
  var $selectDptSubId = $('select[name=dptSubId]');
  var $dpts = $selectDptId.data("dpts");
  // 小館別對應大館別選擇
  $selects.map(function(index,select) {
    var $select = $(select);
    if($select.data('value') != undefined)
      $select.val($select.data('value').toString());
  });
  $selectDptId.change(function() {
    $selectDptSubId.html('');
    $selectDptSubId.append("<option value='-1'>所有館別</option>");
    $dpts[this.value-1].DptSubs.map(function(dptSub, index) {
      $selectDptSubId.append("<option value="+ dptSub.id +">"+ dptSub.name +"</option>");
    });
  });

  $(".btn-group.btn-group-switch").click(function() {
    var className = $(this).find( "label:first" ).attr('class');
    var id = $(this).attr('id');
    // check class name
    if ( className == "btn btn-default btn-sm" ){
      var path = "/product/publish/" + id;
      $.ajax({
        type: "PUT",
        url: path
      });
    } else if( className == "btn btn-default btn-sm active"){
      var path = "/product/unpublish/" + id;
      $.ajax({
        type: "PUT",
        url: path
      });
    }
  });


  var formWithPagination = $('form.with-pagination');
  var inputPage = $('input[name=page]', formWithPagination);
  var inputLimit = $('input[name=limit]', formWithPagination);

  $('.form-control', formWithPagination).change(function() {
    inputPage.val(0);
  });

  $('#pagination-limit').change(function() {
    inputPage.val(0);
    inputLimit.val($(this).val());
    formWithPagination.submit();
  });

  $('#pagination-next').click(function() {
    inputPage.val(parseInt(inputPage.val()) + 1);
    formWithPagination.submit();
  });

  $('#pagination-prev').click(function() {
    inputPage.val(parseInt(inputPage.val()) - 1);
    formWithPagination.submit();
  });
});
