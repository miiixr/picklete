(function ($) {

  var cartViewerInit = function(){
    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {orderItems: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    $('#order-items-count').text(picklete_cart.orderItems.length);
    var cartViewer = $('#cart-viewer');
    var subtotalDiv = $('#subtotal');
    var totalPriceDiv = $('#totalPrice');

    var subtotal = 0;

    picklete_cart.orderItems.forEach(function(orderItem){

      var liOrderItem =
        '<div class="p-20 border-bottom-1">' +
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
        '    ' +
        '    <div class="col-xs-6 col-sm-3 col-md-2 desktop-p-right-0 desktop-text-center desktop-m-top-5 m-bottom-2">' +
        '      此商品不提供<br>包裝服務' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-2 col-md-2 desktop-text-center desktop-m-top-5 m-bottom-1">' +
        '      <h4 class="m-top-0">$1,400<br><small class="text-line-through">$ '+orderItem.price+'</small></h4>' +
        '    </div>' +

        '    <div class="col-xs-6 col-sm-1 col-md-1 text-right desktop-m-top-5"><a href="#" data-toggle="modal" data-target="#modal-delete" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div>' +
        '  </div>' +
        '</div>';

      subtotal += parseInt(orderItem.price, 10);
      subtotalDiv.text(subtotal);
      totalPriceDiv.text(subtotal);

      cartViewer.append(liOrderItem);


    });
  };

  cartViewerInit();

  console.log('=== cartViewerInit ===');


}(jQuery));
