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
  });