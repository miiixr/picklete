(function ($) {
  var picklete_cart = Cookies.getJSON('picklete_cart');
  picklete_cart = picklete_cart ? picklete_cart : window.location.replace("/shop/products");

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
            location.href='../../../admin/bonus?keyword='+$("input[name='email']").val();
        }
    });
  });



  // orderItems:
  //  [ { ProductId: '1', price: '475', quantity: '1' },
  //    { ProductId: '1', price: '590', quantity: '2' }],
  // paymentTotalAmount: '565',
  // user:
  //  { username: 'AAAd',
  //    email: 'user1@picklete.localhost',
  //    mobile: '0912345678',
  //    city: '苗栗縣',
  //    district: '竹南鎮',
  //    zipcode: '350',
  //    address: '測試用地址不用太在意' },
  // shipment:
  //  { username: 'AAAd',
  //    email: 'user1@picklete.localhost',
  //    mobile: '0912345678',
  //    city: '苗栗縣',
  //    district: '竹南鎮',
  //    zipcode: '350',
  //    address: '測試用地址不用太在意' },
  // usedDiscountPoint: 'false' };

}(jQuery));
