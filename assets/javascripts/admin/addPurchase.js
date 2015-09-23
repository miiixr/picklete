$(function() {
  $('#limit').change(function() {
    location.href='/admin/shop-buy-more-add-item?limit='+$(this).val();
  });

  $('.form-control').change(function(){
    $("input[name='page']").val(0);
  });

  $('#bonusNext').click(function(){
    $("input[name='page']").val(parseInt($("input[name='page']").val())+1);
    $("form[name='search']").submit();
  });

  $('#bonusPrevious').click(function(){
    $("input[name='page']").val(parseInt($("input[name='page']").val())-1);
    $("form[name='search']").submit();
  });


  $('#add').click(function(){
    $(".addSelect").each(function(index,dom){
      if(dom.checked){
        $("form[name='updateForm']").append(
          '<input type=\'hidden\' name=\'productIds[]\' value =\''+ dom.value +'\' >'
        );
      }
    });

    //- /admin/buymoreUpdate

    if($("#option1")[0].checked){
      $("#limit").val(0);
      $("#type").val('reduce');
    }else{
      $("#limit").val(1500);
      $("#type").val('discount');
    }

    var postData = $("form[name='updateForm']").serializeArray();
    $.ajax({
        url : '/admin/buymoreUpdate',
        type: "put",
        data : postData,
        success:function()
        {
          console.log("go");
          location.href='../admin/shop-buy-more';
        }
    });

  });
});
