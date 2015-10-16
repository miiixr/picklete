(function ($) {

  var cartViewer = $('#cart-viewer');
  var subtotalDiv = $('#subtotal');
  var totalPriceDiv = $('#totalPrice');
  var buymoreDiv = $("#buymore");
  var packingFeeTD = $("#packingFeeField");
  var discountAmountDiv = $("#discountAmount");
  var quantityVal;

  var subtotal = 0;
  var totalPrice = 0;
  var buymore = 0;
  var discountAmount = 0;

  var shippingFee = 0;
  var shippingFeeFreeThreshold = 390;

  var packableItemTotal = [];
  var packingFee = 60;
  var packingFeeTotal = 0;
  var packingQuantity = 0;

  /* ======================================== */

  Cookies.remove('buyMoreIds');
  Cookies.remove('shopCode');
  var picklete_cart = Cookies.getJSON('picklete_cart');
  if(picklete_cart){
    $("#nothing").remove();
  }else{
    picklete_cart : {orderItems: []};
  }


  // calculate total price
  var calcTatalPrice = function () {
    packingFeeTotal = packingFee * packingQuantity;
    totalPrice = (subtotal + buymore - discountAmount) + shippingFee + packingFeeTotal;
    console.log('=== calcTatalPrice ===', totalPrice);
    totalPriceDiv.text(totalPrice);
  }
  // end

  // re-calculate subtotal price and save quant to cookie in case.
  var reCalSubtotalPriceAndSaveCookie = function(){

    subtotal = 0;

    picklete_cart.orderItems.forEach(function(orderItem, index){
      // console.log('==== orderItem ==>',orderItem);

      quantityVal =  $("input[name='quant["+index+"]']").val();
      // console.log('=== quantityVal ',index,' ===>',quantityVal);

      orderItem.quantity = quantityVal;
      // console.log('=== orderItem.quantity ===>',orderItem.quantity);

      if(orderItem.originPrice == undefined) orderItem.originPrice ='';
      subtotal += parseInt(orderItem.price*orderItem.quantity, 10);
    });
    subtotalDiv.text(subtotal);
    calcTatalPrice();
    // save new quantities
    Cookies.set('picklete_cart', picklete_cart);
  };
  // end

  // save packing fee/quant to cookie.
  var reCalPackingFeeAndSaveCookie = function(){

    picklete_cart.orderItems.forEach(function(orderItem, index){
      packVal =  $("input[name='pack["+index+"]']").val();
      orderItem.packingFee = packingFee;
      orderItem.packingQuantity = packingQuantity;
    });
    // save new quantities
    Cookies.set('picklete_cart', picklete_cart);
  };
  // end

  var cartViewerInit = function() {
    // console.log('==== picklete_cart ==>',picklete_cart);

    picklete_cart.orderItems.forEach(function(orderItem, index){

      // console.log('==== orderItem ==>',orderItem);

      if(orderItem.originPrice == undefined) orderItem.originPrice ='';

      quantity = orderItem.quantity;

      var liOrderItem =
        '<div id="orderItem" class="p-20 border-bottom-1">' +
        '  <div class="row row-m">' +

        '    <div class="col-xs-4 col-sm-3 col-md-2">' +
        '      <div class="item-block"><a href="#" class="item-like"><span class="glyphicon glyphicon-heart"></span></a>' +
        '        <a href="shop-product"><img src="'+orderItem.photos[0]+'" class="img-full"></a>' +
        '      </div>' +
        '    </div>' +

        '    <div class="col-xs-8 col-sm-8 col-md-3 desktop-m-top-4 m-bottom-1 mobile-min-height-100">' +
        '      <h6 class="text-muted text-roboto letter-spacing-1 m-bottom-1-min">' +
        '        <a href="brands">'+ orderItem.brand +'</a>' +
        '      </h6>' +
        '      <h5 class="text-roboto letter-spacing-1 m-top-1-min">' +
        '        <a href="/shop/products/'+orderItem.productGmId+'/'+orderItem.ProductId+'">'+ orderItem.name +'</a>' +
        '      </h5>' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-right-0 desktop-text-center desktop-m-top-5 m-bottom-2">商品數量' +
        '      <div class="productQuantities input-group input-group-count max-width-150"><span class="input-group-btn">' +
        '          <button type="button" disabled="disabled" data-type="minus" data-field="quant['+index+']" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-minus"></span></button></span>' +
        '        <input type="text" name="quant['+index+']" value="'+orderItem.quantity+'" min="1" max="10" class="form-control input-number text-center font-size-slarge"><span class="input-group-btn">' +
        '          <button type="button" data-type="plus" data-field="quant['+index+']" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-plus"></span></button></span>' +
        '      </div>' +
        '    </div>' ;

      if(!orderItem.packable){
        var liPackageService =
          '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-right-0 desktop-text-center desktop-m-top-5 m-bottom-2">' +
          '      此商品不提供<br>包裝服務' +
          '    </div>';
        }else{
          packableItemTotal.push(index);
          var liPackageService =
            '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-right-0 desktop-text-center desktop-m-top-5 m-bottom-2">禮品包裝' +
            '      <div class="packQuantities input-group input-group-count max-width-150"><span class="input-group-btn">' +
            '       <button type="button" disabled="disabled" data-type="minus" data-field="pack['+index+']" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-minus"></span></button></span>' +
            '       <input type="text" name="pack['+index+']" value=0 min="0" max="'+orderItem.quantity+'" class="form-control input-number text-center font-size-slarge"><span class="input-group-btn">' +
            '       <button type="button" data-type="plus" data-field="pack['+index+']" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-plus"></span></button></span>' +
            '      </div>' +
            '    </div>';
        }

      var liPrice =
        '    <div class="col-xs-6 col-sm-2 col-md-2 desktop-text-center desktop-m-top-5 m-bottom-1">' +
        '      <h4 class="m-top-0">$ '+orderItem.price+'<br><small class="text-line-through">'+orderItem.originPrice+'</small></h4>' +
        '    </div>';

      var liRemoveItem =
        '    <div class="col-xs-6 col-sm-1 col-md-1 text-right desktop-m-top-5">' +
        '      <a id="remveOrderItem" data-index="'+index+'" data-productId="'+orderItem.id+'" href="#" data-toggle="modal" data-target="#modal-delete" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      liOrderItem = liOrderItem + liPackageService + liPrice + liRemoveItem;

      subtotal += parseInt(orderItem.price*orderItem.quantity, 10);
      subtotalDiv.text(subtotal);
      totalPrice = subtotal;
      totalPriceDiv.text(totalPrice);

      cartViewer.append(liOrderItem);
    });

    cartViewer.inputNumber();

  };

  // packing fee
  $(".input-group").delegate("input","change", function(){


  });
  // end

  // shippingfee select
  $(".container").on("change", "#shippingFeeSelect", function (e) {
    e.preventDefault();
    calcTatalPrice();
    $("#feeFreeNoticer").text('');

    // judge threshold
    if((subtotal + buymore - discountAmount) > shippingFeeFreeThreshold){
      // fee-free!
      Cookies.set('shippingFee', 0);
      $("#feeFreeNoticer").text('**您符合免運資格:)**');
    }else{
      // Normalization
      shippingFee = parseInt($(this).val(), 10);
      // set cookie
      Cookies.set('shippingFee', shippingFee);
      // show shippingFee to viewfield
      var shippingFeeField = $('#shippingFeeField');
      shippingFeeField.text(shippingFee)
    }
  });
  // end

  $(".container").on("change", "#paymentMethod", function (e) {
    e.preventDefault();
    Cookies.set('paymentMethod', $('#paymentMethod').val());
  });

  var selectedDeleteOrderitem = {};
  var selectedDeleteOrderitemIndex = -1;

  $(".container").on("click", "#remveOrderItem", function (e) {
    e.preventDefault();
    var productId = $(this).attr("data-productId");
    selectedDeleteOrderitemIndex = $(this).attr("data-index");
    console.log('=== remove productId ===', productId);
    selectedDeleteOrderitem = picklete_cart.orderItems[selectedDeleteOrderitemIndex];
    console.log('=== selectedDeleteOrderitem ===', selectedDeleteOrderitem);
    $('#deleteOrderItemName').text(selectedDeleteOrderitem.name);
  });

  $("#confirmedDeleteOrderItem").on("click", function (e) {
    console.log('=== confirmedDeleteOrderItem ===');
    e.preventDefault();
    removeOrderItem(selectedDeleteOrderitem, selectedDeleteOrderitemIndex);
    $('#cart-viewer #orderItem:has(a[data-index="'+selectedDeleteOrderitemIndex+'"])').remove()
  });

  var removeOrderItem = function (orderItem, index) {

     picklete_cart.orderItems.splice(index, 1);
     Cookies.set('picklete_cart', picklete_cart);

     window.location.reload();
  }

  $("#nextSetp").click(function () {
    var buymoreIds = [];
    $("select.form-control.m-bottom-2").each(function(index,dom){
      var id = parseInt($(this).find(":selected")[0].value);
      var price = parseInt($(this).find(":selected")[0].dataset.price);
      var object = { ProductId : id ,quantity: 1, price:price};
      if(id != 0){
        buymoreIds.push(object);
      }
    });
    Cookies.set('buyMoreIds', buymoreIds);

    // shipping
    var shippingType = $("#shippingType").val();
    var shippingFeeTotal = shippingFee;
    var shippingRegion = $('#shippingFeeSelect').find(":selected").attr("data-region")
    var shipping = { shippingType : shippingType ,shippingFee: shippingFeeTotal, shippingRegion: shippingRegion};
    Cookies.set('shipping', shipping);

    // packingFee
    var packing = { packingQuantity: packingQuantity, packingFee: packingFeeTotal};
    Cookies.set('packing', packing);

    if($('#shippingFeeSelect').val() == 0 || $('#paymentMethod').val()==0)
      alert("請確認運送、付款方式");
    else{
      $.ajax({
          url : '/user/loginStatus',
          type: "get",
          data : null,
          success:function(data, textStatus, jqXHR)
          {
            console.log('=== data ==>',data.loginStatus);
            if(data.loginStatus){
              window.location.replace("/user/cart-step-2");
            }else{
              $('#modal-login').modal('show')
            }
          }
      });
    }
  });

  cartViewerInit();

  console.log('=== cartViewerInit ===');

  var previous = 0;
  $("select.form-control.m-bottom-2").on('focus', function(){
    previous = parseInt($(this).find(":selected")[0].dataset.price);
  }).change(function(){
    var id = $(this).find(":selected")[0].value;
    var price = parseInt($(this).find(":selected")[0].dataset.price);
    buymore -= previous;
    buymore += price;
    buymoreDiv.text(buymore);
    $(this).blur();
    calcTatalPrice();
  });


  // recalculate price when btnPlus/bntMinus is pressed or clicked.
  $(".productQuantities").delegate("input","change", function(){
    // calculate price and save cookie before do anything.
    reCalSubtotalPriceAndSaveCookie();
    calcTatalPrice();

    // get target prudoct quantity value and its field id.
    var thisName = $(this).attr('name');
    // console.log('=== thisName ===>',thisName);
    var itemQuantId = thisName.charAt(6);
    // console.log('=== itemQuantId ===>',itemQuantId);
    var itemQuantVal = $(this).val();
    // console.log('=== itemQuantVal ===>',itemQuantVal);

    // set new maximum value
    var targetPackedCount = $("input[name='pack["+itemQuantId+"]']");
    // console.log('=== releted pack field name ==>',targetPackedCount.attr('name'));
    targetPackedCount.attr('max',itemQuantVal);

    if(targetPackedCount.val() > itemQuantVal)
      targetPackedCount.val(itemQuantVal);
  });
  // end


  // recalculate price when btnPlus/bntMinus is pressed.
  $(".packQuantities").delegate("input","change", function(){
    packingQuantity = 0;
    // console.log('=== picklete_cart.orderItems.length ===>',picklete_cart.orderItems.length);
    packableItemTotal.forEach(function(value){
       var count = parseInt($("input[name='pack["+value+"]']").val());
       console.log('=== value ==>',value,'=== count ===>',count);
       packingQuantity += count;
    });
    // console.log('=== packingQuantity ===>',packingQuantity);

    //
    packingFeeTotal = packingQuantity * packingFee;

    // set value to TD field
    packingFeeTD.text(packingFeeTotal);

    // calculate price and save cookie after finish.
    calcTatalPrice();
  });
  //end


  // shippings
  $("#shippingType").change(function(){

    $("#shippingFeeSelect").empty();

    var url, data, region, fee, shipping;
    url = '/shipping/'+$("#shippingType").val();
    data = $("#shippingType").val();

    // if( data == "0" ){
      $("#shippingFeeSelect").append($("<option></option>").attr("value", "0").text("請選擇"));
    // }else{
      $.ajax({
          url : url,
          type: "get",
          data : null,
          success:function(data, textStatus, jqXHR)
          {
            var shippingFeeSelect = $("#shippingFeeSelect");
            for(i=0;i<data.shippings.length;i++){
              shipping = data.shippings[i].region + ' ' + data.shippings[i].fee + ' 元';
              shippingFeeSelect.append($("<option data-region='"+data.shippings[i].region+"'></option>").attr("value", data.shippings[i].fee).text(shipping));
            }
          }
      });
    // } // end else
  });
  // end shippings

var checkCode = function(){
  var check ={
    code: $("#code").val(),
    price: subtotal
  }
  $.ajax({
      url : '/checkCode',
      type: "get",
      data : check,
      success:function(data, textStatus, jqXHR){
        console.log('=== data ==>',data);
        discountAmount = data.discountAmount;
        discountAmountDiv.text(data.discountAmount);
        calcTatalPrice();
        alert("確認使用此折扣!!");
        Cookies.set('shopCode', data);
      },
      error: function(data, textStatus, jqXHR){
        discountAmount = 0;
        discountAmountDiv.text("0");
        calcTatalPrice();
        alert(JSON.parse(data.responseText).message);
        $("#code").val("");
        Cookies.remove('shopCode');
      }
  });
};
  $("#shopCodeCheck").click(function(){
    checkCode();
  });

}(jQuery));
