$(window).load(function() {
  var currentPage = $('#control-menu').data('currentpage');
  $('#control-menu>.panel>div.panel-collapse.collapse>ul>li>a[href='+ currentPage +']').addClass('active');
});
