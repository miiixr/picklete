(($) ->

  # new UISearch(document.getElementById( 'sb-search' ));
  $(window).load () ->
      $(".loader").fadeOut("slow")

  $(document).ready () ->
    $('.add-to-cart').on 'click', () ->
      $(this).notifyMe(
        'top',
        'cart',
        '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>已加入購物車',
        '',
        300,
        1500
      );

    $('input[type="checkbox"]').click () ->
      if $(this).attr("value")=="showhide-sent"
        $(".showhide-sent").toggle()

      if $(this).attr("value")=="showhide-invoice"
        $(".showhide-invoice").toggle()

    $('[data-toggle="tooltip"]').tooltip()



    sticky_relocate = () ->
      window_top = $(window).scrollTop();
      div_top = $('#sticky-anchor')
      unless div_top.length < -1
        return
      div_top.offset().top - $(window).width() /2;
      if window_top > div_top
        $('#sticky').addClass('stick')
      else
        $('#sticky').removeClass('stick')
      
    $(window).scroll(sticky_relocate)
    sticky_relocate()

  # new cbpScroller( document.getElementById( 'cbp-so-scroller' ) );
)(jQuery)
