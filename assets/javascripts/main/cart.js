(function ($) {

  var cartViewer = $('#cart-viewer');
  var subtotalDiv = $('#subtotal');
  var totalPriceDiv = $('#totalPrice');
  var buymoreDiv = $("#buymore");

  var subtotal = 0;
  var totalPrice = 0;
  var shippingFee = 0;
  var buymore = 0;

  Cookies.remove('buyMoreIds');
  var picklete_cart = Cookies.getJSON('picklete_cart');
  if(picklete_cart){
    $("#nothing").remove();
  }else{
    picklete_cart : {orderItems: []};
  }

  var cartViewerInit = function(){

    picklete_cart.orderItems.forEach(function(orderItem, index){

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
        '        <a href="shop-product">'+ orderItem.name +'</a>' +
        '      </h5>' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-left-0 desktop-m-top-5 m-bottom-2">' +
        '      <div class="input-group input-group-count max-width-150"><span class="input-group-btn">' +
        '          <button type="button" disabled="disabled" data-type="minus" data-field="quant[1]" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-minus"></span></button></span>' +
        '        <input type="text" name="quant[1]" value="'+orderItem.quantity+'" min="1" max="10" class="form-control input-number text-center font-size-slarge"><span class="input-group-btn">' +
        '          <button type="button" data-type="plus" data-field="quant[1]" class="btn btn-default btn-number p-left-2 p-right-2"><span class="glyphicon glyphicon-plus"></span></button></span>' +
        '      </div>' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-right-0 desktop-text-center desktop-m-top-5 m-bottom-2">' +
        '      此商品不提供<br>包裝服務' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-2 col-md-2 desktop-text-center desktop-m-top-5 m-bottom-1">' +
        '      <h4 class="m-top-0">$ '+orderItem.price+'<br><small class="text-line-through"></small></h4>' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-1 col-md-1 text-right desktop-m-top-5">' +
        '      <a id="remveOrderItem" data-index="'+index+'" data-productId="'+orderItem.id+'" href="#" data-toggle="modal" data-target="#modal-delete" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      subtotal += parseInt(orderItem.price, 10);
      subtotalDiv.text(subtotal);
      totalPrice = subtotal;
      totalPriceDiv.text(totalPrice);

      cartViewer.append(liOrderItem);


    });
  };

  $(".container").on("change", "#shippingFeeSelect", function (e) {
    e.preventDefault();

    Cookies.set('shippingFee', $('#shippingFeeSelect').val());

    shippingFee = parseInt($(this).val(), 10);

    var shippingFeeField = $('#shippingFeeField');
    shippingFeeField.text(shippingFee)

    calcTatalPrice();

  });

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



  var calcTatalPrice = function () {

    totalPrice = subtotal + shippingFee + buymore;
    console.log('=== calcTatalPrice ===', totalPrice);

    totalPriceDiv.text(totalPrice);
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
            console.log('=== data ==>',data.shippings);
            for(i=0;i<data.shippings.length;i++){
              shipping = data.shippings[i].region + ' ' + data.shippings[i].fee + ' 元';
              $("#shippingFeeSelect").append($("<option></option>").attr("value", data.shippings[i].fee).text(shipping));
            }
          }
      });
    // } // end else
  });
  // end shippings
}(jQuery));
