(function ($) {

  $(".loader").fadeOut("slow");

  // /notifyme
  $('.add-to-cart').on('click', function(){
    $(this).notifyMe(
      'top',
      'cart',
      '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>已加入購物車',
      '',
      300,
      1500
    );
  });

  new UISearch( document.getElementById( 'sb-search' ) );

  function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top - $(window).width() /2;
    if (window_top > div_top) {
      $('#sticky').addClass('stick');
    } else {
      $('#sticky').removeClass('stick');
    }
  }

  $(window).scroll(sticky_relocate);
  sticky_relocate();



  $('[data-toggle="tooltip"]').tooltip();

  $('input[type="checkbox"]').click(function(){
    if($(this).attr("value")=="showhide-sent"){
      $(".showhide-sent").toggle();
    }
    if($(this).attr("value")=="showhide-invoice"){
      $(".showhide-invoice").toggle();
    }
  });

  new cbpScroller( document.getElementById( 'cbp-so-scroller' ) );

}(jQuery));
