(function ($) {
  $('.dpt').on("click", function(e){
    var e = $(event.currentTarget);
    //正式上線後要依據大館別固定數量更改
    for(i=1; i<=9; i++) {
      document.getElementById('subDpt' + i).className="tab-pane fade";

    }
    document.getElementById('subDpt' + e.data('id')).className="tab-pane fade in active";

  });

  $(".container").on("click", ".item-like, .label-like", function (e) {
    e.preventDefault();
    
    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;
    
    if ($(target).hasClass("active"))
      $(target).removeClass("active");
    else
      $(target).addClass("active");
  });


}(jQuery));
