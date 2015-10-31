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
  var shippingFeeField = $('#shippingFeeField');
  var shippingFeePrice = parseInt(Cookies.getJSON('shipping').shippingFee);
  var shippingFeeFree = (Cookies.getJSON('shipping').shippingFeeFree);
  if(shippingFeeFree) {
    shippingFeeField.text('免運');
    shippingFeePrice = 0;
  } else {
    shippingFeeField.text(shippingFeePrice);
  }

  // display packing fee
  var packingFeeField = $('#packingFeeField');
  var packingFeePrice = parseInt(Cookies.getJSON('packing').packingFee);
  console.log('=== packingFeePrice ===>',packingFeePrice);
  packingFeeField.text(packingFeePrice);

  var picklete_cart = Cookies.getJSON('picklete_cart');
  picklete_cart = picklete_cart ? picklete_cart : window.location.replace("/shop/products");

  var buyMoreObject = Cookies.getJSON('buyMoreIds');
  var shopCodeObject =Cookies.getJSON('shopCode');

  var subtotalDiv = $('#subtotal');
  var totalPriceDiv = $('#totalPrice');
  var buymoreDiv = $('#buymore');
  var packingFeeTD = $("#packingFeeField");

  var subtotal = 0;
  var totalPrice = 0;
  var buymore = picklete_cart.buymore || 0;
  if(buyMoreObject){
    buyMoreObject.forEach(function(item,index){
      buymore += item.price;
    });
  }
  buymoreDiv.text(buymore);

  picklete_cart.orderItems.forEach(function(orderItem, index){
    subtotal += parseInt(orderItem.price*orderItem.quantity, 10);
    subtotalDiv.text(subtotal.formatMoney());
    totalPrice = subtotal;
  });

  // count 加價購
  totalPrice += buymore;

  // count packing fee
  var packingFee = parseInt(Cookies.getJSON('packing').packingFee);
  packingFeeTD.text(packingFee);
  totalPrice += shippingFeePrice;
  totalPrice += packingFee;

  var discountAmountDiv = $("#discountAmount");
  var discountAmount = 0;
  if(shopCodeObject){
    discountAmount = shopCodeObject.discountAmount;
    discountAmountDiv.text(discountAmount);
    totalPrice -= discountAmount;
  }

  totalPrice = parseInt(Cookies.getJSON('calcTatalPrice'));
  // count shipping fee and display
  totalPriceDiv.text('$' + totalPrice.formatMoney(0));



  $("#btnOrderCreate").click(function() {
    if($("input[name='order[user][fullName]']").val() == ""){
      alert("請輸入姓名");
      $("input[name='order[user][fullName]']").focus();
      return;
    }

    if($("input[name='order[user][mobile]']").val() == ""){
      alert("請輸入電話");
      $("input[name='order[user][mobile]']").focus();
      return;
    }

    if($("select[name='order[user][city]']").val() == "") {
      alert("請選擇縣市");
      $("select[name='order[user][city]']").focus();
      return;
    }

    if($("input[name='order[user][address]']").val() == ""){
      alert("請輸入住址");
      $("input[name='order[user][address]']").focus();
      return;
    }

    if($("select[name='order[invoice][type]']").val() == ""){
      $("select[name='order[invoice][type]']").focus();
      alert("選擇發票類型");
      return;
    }

    // ensure title
    if($("select[name='order[invoice][type]']").val() == "triplex") {
      if ($("input[name='order[invoice][title]']").val() == "") {
        alert("請輸入公司抬頭");
        $("input[name='order[invoice][title]']").focus();
        return;
      } 
      if ($("input[name='order[invoice][taxId]']").val() == "") {
        alert("請輸入統一編號");
        $("input[name='order[invoice][taxId]']").focus();
        return;
      }
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

    postData.order.additionalPurchasesItem = picklete_cart.additionalPurchasesItem


    if(shopCodeObject){
      postData.order.shopCode = shopCodeObject.code;
    }

    var shipping = Cookies.getJSON('shipping');
    postData.order.shipment.shippingFee = shipping.shippingFee;
    postData.order.shipment.shippingType = shipping.shippingType;
    postData.order.shipment.shippingRegion = shipping.shippingRegion;

    // packing things
    var packing = Cookies.getJSON('packing');
    postData.order.packingFee = packing.packingFee;
    postData.order.packingQuantity = packing.packingQuantity;

    console.log('=== postData ===', postData);

    Cookies.remove('shippingType');
    Cookies.remove('paymentMethod');
    Cookies.remove('shippingRegion');
    Cookies.remove('code');
    Cookies.remove('calcTatalPrice');

    $.ajax(
    {
        url : '/api/order',
        type: "post",
        data : postData,
        success:function(data, textStatus, jqXHR)
        {
            $(document.body).html(data);

        },
        error: function (jqXHR, exception) {
          var err = jQuery.parseJSON(jqXHR.responseText);

          // $(this).notifyMe(
          //   'top',
          //   'cart',
          //   '<span style="color:red" class="glyphicon glyphicon-warning m-right-2"></span>'+ err.message,
          //   '',
          //   300,
          //   3000
          // );

          alert(err.message);
          window.history.go(-1);

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

  $('#invoiceType').change(function(){
    console.log('#invoiceType change');

    var invoiceType = $('#invoiceType').val();
    var invoiceDetail = $('.showhide-invoice');


    var charityNameField =
      '<div class="form-group">' +
      '  <p class="pull-right">※發票將每月隨機捐給各慈善機構，如：家扶基金會、中華社會福利聯合勸募協會等。</p>' +
      '</div>';

    var titleField =
      '<div class="form-group">' +
      '  <label class="col-sm-3 control-label">公司抬頭<span class="text-danger">*</span></label>' +
      '  <div class="col-sm-9">' +
      '    <input type="text" name="order[invoice][title]" placeholder="請輸入公司抬頭" class="form-control" required />' +
      '  </div>' +
      '</div>';

    var taxIdField =
      '<div class="form-group">' +
      '  <label class="col-sm-3 control-label">統一編號<span class="text-danger">*</span></label>' +
      '  <div class="col-sm-9">' +
      '    <input type="text" name="order[invoice][taxId]" placeholder="請輸入統一編號" class="form-control" required />' +
      '  </div>' +
      '</div>';

    invoiceDetail.html('');

    if(invoiceType == 'duplex')
      return;
      // invoiceDetail.html(taxIdField);

    if(invoiceType == 'triplex')
      invoiceDetail.html(titleField+taxIdField);

    if(invoiceType == 'charity') {
      invoiceDetail.html(charityNameField);
      return;
    }

  });


}(jQuery));
