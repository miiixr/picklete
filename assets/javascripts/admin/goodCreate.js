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
  else{
    $("#brandSelect").prop('required', false);
    }
  }
});


$(".color-filter").click(function(){
  $("#color-filter").attr('class', $(this).attr('class'));
});

$('form').on('click','.btn-add',function(e){
  e.preventDefault();
  s = $($(this).parent().parent()).prop('outerHTML');
  $(this).parent().parent().after(s);
  $(this).remove();
});

$('.row').on('click','.btn-remove',function(e){
  e.preventDefault();
  if($(this).context.nextElementSibling == null){
    $(this).parent().parent().remove();
  }
});



