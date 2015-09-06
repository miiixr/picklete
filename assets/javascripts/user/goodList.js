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



  var submitLock = false;
  $(".btn-group.btn-group-switch").click(function() {
    var className = $(this).find( "label:first" ).attr('class');
    var id = $(this).attr('id');

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
    var flash = req.flash('message')
    $(".alert.alert-danger").find( "p" ).text(flash);
    console.log(id);
    console.log(className);
    console.log(flash);



  });


  //
  // $("#btnSave").click(function() {
  //   //alert('clicked!');
  //   var table_data = [];
  //   $('tr').each(function(){
  //       var row_data = [];
  //
  //       $('td', this).each(function(){
  //         //  row_data.push($(this).text());
  //           row_data.push($("input[name='options']").val());
  //
  //         //  row_data.push($(this).closest('td').find('input[type="text"]:visible'));
  //       });
  //
  //       table_data.push(row_data);
  //
  //   });
  //   console.log(table_data);
  // });

});
