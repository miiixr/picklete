(function ($) {

  var ACTIVE_CLASS = 'active';

  $('.type.name').click(function(event){
    var e = $(event.currentTarget);
    var id = e.data('id');
    var length = e.data('length');
    $('.type.name').removeClass(ACTIVE_CLASS);

    for(i=1; i<=length; i++) {
      document.getElementById('FAQ' + i).style.display = "none";
    }

    $("#FAQ" + id).fadeIn()
    e.addClass(ACTIVE_CLASS);
  });

}(jQuery));
