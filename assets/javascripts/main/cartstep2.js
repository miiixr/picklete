(function ($) {
  var picklete_cart = Cookies.getJSON('picklete_cart');
  picklete_cart = picklete_cart ? picklete_cart : window.location.replace("/shop/products");

  var subtotalDiv = $('#subtotal');
  var totalPriceDiv = $('#totalPrice');

  var subtotal = 0;
  var totalPrice = 0;

  picklete_cart.orderItems.forEach(function(orderItem, index){
    subtotal += parseInt(orderItem.price, 10);
    subtotalDiv.text(subtotal);
    totalPrice = subtotal;
    totalPriceDiv.text(totalPrice);
  });

  $("#orderCreate").click(function()
  {
    if($("input[name='order[user][username]']").val()==""){
      alert("請輸入姓名");
      return;
    }
    if($("input[name='order[user][mobile]']").val()==""){
      alert("請輸入電話");
      return;
    }
    if($("input[name='order[user][address]']").val()==""){
      alert("請輸入住址");
      return;
    }
    var postData = $("form[name='orderCreate']").serializeJSON();
    postData.order.orderItems = picklete_cart.orderItems;
    postData.order.shippingFee = Cookies.getJSON('shippingFee');
    postData.order.paymentMethod = Cookies.getJSON('paymentMethod');
    $.ajax(
    {
        url : '/api/order',
        type: "post",
        data : postData,
        success:function(data, textStatus, jqXHR)
        {
            $(document.body).html(data);
        }
    });
  });

}(jQuery));
