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
    var postData = $("form[name='orderCreate']").serializeJSON();
    postData.order.orderItems = picklete_cart.orderItems;
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
