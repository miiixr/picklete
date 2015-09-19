(function ($) {


  $('.type.name').click(function(event){
    var e = $(event.currentTarget);
    var id = e.data('id');
    var length = e.data('length');
    console.log(e);
    for(i=1; i<=length; i++) {
      document.getElementById('FAQ' + i).style.display = "none";
    }
    document.getElementById('FAQ'+id).style.display = "block";
  });

}(jQuery));
