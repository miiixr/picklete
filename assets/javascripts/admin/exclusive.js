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

  var $type1 = $('#type1')[0].innerHTML;
  var $type2 = $('#type2')[0].innerHTML;
  var $type3 = $('#type3')[0].innerHTML;
  var $type4 = $('#type4')[0].innerHTML;


  $('#modal-control-index-exclusive-type').on('click','.btn-green',function(e){
    e.preventDefault();
    var $checked = $('input:checkbox:checked[name="exclusive-type"]').map(function() { return $(this).val(); }).get();

    for (var i in $checked){

      var itemLength = $('.well');
      var index = itemLength ? itemLength.length : 0;

      var check = $checked[i];
      if(check == 1){
        $('.col-sm-9.col-md-10').append($type1.replace(/{index}/g, index));
      }
      if(check == 2){
        $(".col-sm-9.col-md-10").append($type2.replace(/{index}/g, index));
      }
      if(check == 3){
        $(".col-sm-9.col-md-10").append($type3.replace(/{index}/g, index));
      }
      if(check == 4){
        $(".col-sm-9.col-md-10").append($type4.replace(/{index}/g, index));
      }
    }

    var maxType = $("li.control-well").length;
    var newTypeInput = $("li.control-well")[maxType-1].getElementsByTagName("input");
    $.each( newTypeInput, function( key, dom ) {
      console.log( key + ": " + dom.name);
      dom.name = dom.name.replace(/actives\[\w\]/,'actives['+(maxType-1)+']');
    });

    var newTypeUrl = $("li.control-well")[maxType-1].getElementsByClassName('urlInput');
    $.each( newTypeUrl, function( key, dom ) {
      console.log( key + ": " + dom.value);
      dom.value = "" ;
    });

  });

  // input check when form submit
  $('form#activesData').submit(function(e){
    e.preventDefault();
    $(".activityWeigth").map(function(index, input){
      $(this).val(index)
    });

    var fileNodes = $(".file-value") || [];
    var finished = true;
    $.each(fileNodes, function (idx, item) {
      
      if (item.value == '') {
        item.focus();
        finished = false;
      }
    });

    if ( ! finished) {
      alert("請等待圖片上傳中，或者尚未選擇圖片！")
      return finished;
    }

    $(this).off("submit").submit();
    
    return finished;
  });

}(jQuery));
