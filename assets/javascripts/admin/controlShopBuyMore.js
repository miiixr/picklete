$(function() {
  var $a_tab1 = $('#a-tab1');
  var $a_tab2 = $('#a-tab2');
  var $tab_container = $('#tab-container');
  // $tab_container.data('tabStatus');
  if ( $tab_container.data('tab-status') == 2 )
    $a_tab2.click();

  // $a_tab1.onClick(function() {
  //
  // });
  // $a_tab2.onClick(function() {
  //
  // });

  $('form').submit(function() {
    var $inputTabStatus = $("<input>")
      .attr("type", "hidden")
      .attr("name", "tabStatus").val(2);

    var a_tab2_class = $a_tab2.parent().attr('class')? $a_tab2.parent().attr('class'):'';
    if( a_tab2_class.indexOf('active') )
      $inputTabStatus = $inputTabStatus.val(1);

    $(this).append($inputTabStatus);
    return true;
  });
});
