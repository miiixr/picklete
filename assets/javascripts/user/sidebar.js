$(window).load(function() {
  var currentPage = $('#control-menu').data('currentpage');
  $('#control-menu .panel-collapse li>a[href='+ currentPage +']').addClass('active');
});
