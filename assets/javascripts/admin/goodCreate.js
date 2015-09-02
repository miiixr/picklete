$("#brandSelect").val(undefined);
$("#brandSelect").change(function() {
  if($("#brandSelect :selected").text() != '選擇品牌')
    $("input[type='radio'][name='brandType'][value='origin']").prop("checked", true);
});
$("input[type='text'][name='customBrand']" ).focus(function() {
  $("input[type='radio'][name='brandType'][value='custom']").prop("checked", true);
});


$(".color-filter").click(function(){
  $("#color-filter").attr('class', $(this).attr('class'));
});

$('form').on('click','.btn-add',function(e){
  e.preventDefault();
  s = $($(this).parent().parent()).prop('outerHTML');  
  console.log($(this).parent().parent());  
  $(this).parent().parent().before(s);
});

$('.row').on('click','.btn-remove',function(e){
  e.preventDefault();
  $(this).parent().parent().remove();
});