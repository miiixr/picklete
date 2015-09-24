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

  $("input[name='reducePrice']").change(function(){
    $("input[name='discount']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='discount']").change(function(){
    $("input[name='reducePrice']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $('#add').click(function(){
    var select =[];
    $(".addSelect").each(function(index,dom){
      if(dom.checked){
        select.push(dom);
        $("form[name='updateForm']").append(
          '<input type=\'hidden\' name=\'productIds[]\' value =\''+ dom.value +'\' >'
        );
      }
    });

    if($("input[name='reducePrice']").val()=="" && $("input[name='discount']").val()==""){
      alert("記得輸入折扣喔");
      return;
    }

    if(select.length==0){
      alert("記得選取折扣項目喔");
      return;
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
