$(window).load(function() {
  var currentPage = $('#control-menu').data('currentpage');
  var $currentLi = $('#control-menu .panel-collapse li>a[href="'+ currentPage +'"]');

  $currentLi.addClass('active')
    .parents('div.panel-collapse').addClass('in')
    .siblings('a.control-menu-top').removeClass('collapsed');
});
