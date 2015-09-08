(function ($) {
  $("ul").sortable();

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    if(that.context.nextElementSibling == null){
      that.parent().parent().parent().remove();
    }
  });

  var $type1 = $('.type1')[0].outerHTML;
  var $type2 = $('.type2')[0].outerHTML;
  var $type3 = $('.type3')[0].outerHTML;
  var $type4 = $('.type4')[0].outerHTML;

  $('.row').on('click','.btn-green',function(e){
    e.preventDefault();
    var $checked = $('input:checkbox:checked[name="exclusive-type"]').map(function() { return $(this).val(); }).get();
    var $img = ['http://fakeimg.pl/1100x160/dddddd/FFF/?text=1100x160','http://fakeimg.pl/1100x350/dddddd/FFF/?text=1100x350','http://fakeimg.pl/545x350/dddddd/FFF/?text=545x350','http://fakeimg.pl/360x230/dddddd/FFF/?text=360x230']

    for (var check in $checked){
      if(check == 0){
        $('ul.col-sm-9.col-md-10').append($type1);
      }
      if(check == 1){
        $('ul.col-sm-9.col-md-10').append($type2);
      }
      if(check == 2){
        $('ul.col-sm-9.col-md-10').append($type3);
      }
      if(check == 3){
        $('ul.col-sm-9.col-md-10').append($type4);
      }        
    }
  });
}(jQuery));