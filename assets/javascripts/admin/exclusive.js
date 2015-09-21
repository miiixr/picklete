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
        $("ul.col-sm-9.col-md-10").append($type2);
      }
      if(check == 3){
        $("ul.col-sm-9.col-md-10").append($type3);
      }
      if(check == 4){
        $("ul.col-sm-9.col-md-10").append($type4);
      }
    }

    var maxType = $("li.control-well").length;
    var newTypeInput = $("li.control-well")[maxType-1].getElementsByTagName("input");
    $.each( newTypeInput, function( key, dom ) {
      console.log( key + ": " + dom.name);
      dom.name = dom.name.replace(/actives\[\w\]/,`actives[${maxType-1}]`);
    });

    var newTypeUrl = $("li.control-well")[maxType-1].getElementsByClassName('urlInput');
    $.each( newTypeUrl, function( key, dom ) {
      console.log( key + ": " + dom.value);
      dom.value = "" ;
    });

  });

  // input check when form submit
  $('form#activesData').submit(function(e){
    $(".activityWeigth").map(function(index, input){
      $(this).val(index)
    });
    var finished = true;
    $('input[form="activesData"]').map(function(index, input){
      var value = $(input).val();
      if(value.length<1) {
        finished = false;
      }
    });
    if(!finished) {
      alert('請完整填寫圖片及連結欄位');
    }
    return finished;
  });

}(jQuery));
