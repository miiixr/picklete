(function ($) {

  $("ul").sortable();

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      if(that.context.nextElementSibling == null){
        that.parent().parent().parent().remove();
      }
    });
  });

  var $type1 = $('.type1')[0].outerHTML;
  var $type2 = $('.type2')[0].outerHTML;
  var $type3 = $('.type3')[0].outerHTML;
  var $type4 = $('.type4')[0].outerHTML;

  $('#modal-control-index-exclusive-type').on('click','.btn-green',function(e){
    e.preventDefault();
    var $checked = $('input:checkbox:checked[name="exclusive-type"]').map(function() { return $(this).val(); }).get();

    for (var i in $checked){
      var check = $checked[i];
      if(check == 1){
        $('ul.col-sm-9.col-md-10').append($type1);
      }
      if(check == 2){
        $('ul.col-sm-9.col-md-10').append($type2);
      }
      if(check == 3){
        $('ul.col-sm-9.col-md-10').append($type3);
      }
      if(check == 4){
        $('ul.col-sm-9.col-md-10').append($type4);
      }        
    }
  });  
  
}(jQuery));