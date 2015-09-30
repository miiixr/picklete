(function ($) {
  // about twzipcode plugin
  // pre-load data from controller
  var userZipcode = $('input[name="userZipcode"]').val();
  var userCity = $('input[name="userCity"]').val();
  var userRegion = $('input[name="userRegion"]').val();
  // load twzipcode plugin itself - user side
  var twzipcodeUser = function(){
    $('#twzipcodeUser').twzipcode({
      'countyName'   : 'order[user][city]',
      'districtName' : 'order[user][region]',
      'zipcodeName'  : 'order[user][zipcode]',
      'css': [
        'form-control width-auto inline-block',
        'form-control width-auto inline-block',
        'form-control width-auto inline-block'],
      'zipcodeSel' : userZipcode,
      'countySel' : userCity,
      'districtSel' : userRegion
    });
  };
  twzipcodeUser();
  // load twzipcode plugin itself - shipment side
  var twzipcodeShipment = function(){
    $('#twzipcodeShipment').twzipcode({
      'countyName'   : 'order[shipment][city]',
      'districtName' : 'order[shipment][region]',
      'zipcodeName'  : 'order[shipment][zipcode]',
      'css': [
        'form-control width-auto inline-block',
        'form-control width-auto inline-block',
        'form-control width-auto inline-block'],
      'zipcodeSel' : userZipcode,
      'countySel' : userCity,
      'districtSel' : userRegion
    });
  };
  twzipcodeShipment();
  // end twzipcode

  // display shipping fee
  var shippingFeeDiv = $('#shippingFeeField');
  var shippingFeePrice = parseInt(Cookies.getJSON('shippingFee'));
  shippingFeeDiv.text(shippingFeePrice);

  var picklete_cart = Cookies.getJSON('picklete_cart');
  picklete_cart = picklete_cart ? picklete_cart : window.location.replace("/shop/products");

  var buyMoreObject = Cookies.getJSON('buyMoreIds');

  var subtotalDiv = $('#subtotal');
  var totalPriceDiv = $('#totalPrice');
  var buymoreDiv = $('#buymore');

  var subtotal = 0;
  var totalPrice = 0;
  var buymore = 0;
  if(buyMoreObject){
    buyMoreObject.forEach(function(item,index){
      buymore += item.price;
    });
  }
  buymoreDiv.text(buymore);

  picklete_cart.orderItems.forEach(function(orderItem, index){
    subtotal += parseInt(orderItem.price, 10);
    subtotalDiv.text(subtotal);
    totalPrice = subtotal;
  });

  // count 加價購
  totalPrice += buymore;

  // count shipping fee and display
  totalPriceDiv.text(totalPrice+shippingFeePrice);

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

    re = /^[09]{2}[0-9]{8}$/;
    if (!re.test($("input[name='order[user][mobile]']").val())){
      alert("你的手機格式不對！");
      return;
    }

    var postData = $("form[name='orderCreate']").serializeJSON();
    picklete_cart.orderItems = buyMoreObject?picklete_cart.orderItems.concat(buyMoreObject):picklete_cart.orderItems;
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

  $( "input[name='order[user][address]']" ).change(function() {
    $("input[name='order[shipment][address]']").val($( "input[name='order[user][address]']" ).val());
  });

  $( "input[name='order[user][mobile]']" ).change(function() {
    $("input[name='order[shipment][mobile]']").val($( "input[name='order[user][mobile]']" ).val());
  });

  $( "input[name='order[user][username]']" ).change(function() {
    $("input[name='order[shipment][username]']").val($( "input[name='order[user][username]']" ).val());
  });

  // about giftly - show a new form and ship it as a gift.
  $('input[name="giftly"]').change(function() {
    if(this.checked){
      $("#formShipment").show();
      // $("#userAddress").hide();
      // $('#twzipcodeUser').twzipcode('destroy');
      // twzipcodeShipment();
    }else{
      $("#formShipment").hide();
      // $("#userAddress").show();
      // $('#twzipcodeShipment').twzipcode('destroy');
      // twzipcodeUser();
    }
  });
  // end giftly

}(jQuery));
