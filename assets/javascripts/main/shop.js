(function ($) {
  $('.dpt').on("click", function(e){
    var e = $(event.currentTarget);
    //正式上線後要依據大館別固定數量更改
    for(i=1; i<=9; i++) {
      document.getElementById('subDpt' + i).className="tab-pane fade";
      $('.productDptId'+i).css("display","none");
    }
    document.getElementById('subDpt' + e.data('id')).className="tab-pane fade in active";
    $('.productDptId'+e.data('id')).css("display","block");
  });


}(jQuery));
