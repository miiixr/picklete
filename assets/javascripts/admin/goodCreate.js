(function ($) {
  
  $("#brandSelect").val(undefined);
  $("#brandSelect").change(function() {
    if($("#brandSelect :selected").text() != '選擇品牌'){
      $("input[type='radio'][name='brandType'][value='origin']").prop("checked", true);
      $("input[type='radio'][name='brandType'][value='custom']").prop("checked", false);
    }
  });
  $("input[type='text'][name='customBrand']" ).focus(function() {
    $("input[type='radio'][name='brandType'][value='custom']").prop("checked", true);
    $("input[type='radio'][name='brandType'][value='origin']").prop("checked", false);

  });

  $('input[type=submit]').click(function () {
    if( $('input[name=brandType]:checked').val() == 'origin' ){
      if($("#brandSelect :selected").text() == '選擇品牌'){
        $("#brandSelect").prop('required', true);
      }
    }
    else{
      $("#brandSelect").removeAttr('required');
    }
  });


  $(".color-filter").click(function(){
    $("#color-filter").attr('class', $(this).attr('class'));
  });

  $('form').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    var s = $(that.parent().parent()).prop('outerHTML');
    that.parent().parent().after(s);
    that.remove();
  });

  $('.row').on('click','.btn-remove',function(e){
    e.preventDefault();
    var that = $(this);
    if(that.context.nextElementSibling == null){
      that.parent().parent().remove();
    }
  });  


  $('.tag').click(function(e){
    e.preventDefault();
    var that = $(this);
    var s = that[0].innerText;
    $('input[type="text"][name="tag"]').val($('input[type="text"][name="tag"]').val() + ','+ s);
    $('.tagsinput input').before('<span class="tag label label-default">'+ s +'<span data-role="remove">×</span></span>');
  });

}(jQuery));




