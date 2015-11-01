$(function() {
  
  $('#order-query-limit').change(function() {
    location.href='/admin/order?limit='+$(this).val();
  });

  $('.form-control').change(function(){
    $("input[name='page']").val(0);
  });

  $('#next').click(function(){
    console.log()
    $("input[name='page']").val(parseInt($("input[name='page']").val())+1);
    $("form[name='searchOrders']").submit();
  });

  $('#previous').click(function(){
    $("input[name='page']").val(parseInt($("input[name='page']").val())-1);
    $("form[name='searchOrders']").submit();
  });

  $(".status").change(function(){
    switch(parseInt($(this).val())){
      case 1:
        var orderId = $(this).children('option:selected').attr('data-value');
        document.location.href="/order/statusUpdate/"+orderId+"?status=paymentConfirm";
        break;
      case 2:
        var orderId = $(this).children('option:selected').attr('data-value');
        document.location.href="/order/statusUpdate/"+orderId+"?status=deliveryConfirm";
        break;
    }
  });

  $("#print").click(function(){
    var id = '';
    $.each($(".printSelect:checked"),function(){
      id = id + $(this).val() + ',';
    });
    id = id.substring(0,id.length-1);
    document.location.href="/print?id="+id;
  });

  $(".cancel-order").on("click", function () {
    var id = $(this).data("id");
    $.get("/api/order/cancel/" + id + "?status=orderCancel")
    .done(function () {
      window.location.reload();
    })
    .fail(function () {
      alert("更新失敗，請重新嘗試");
    });
  });
});