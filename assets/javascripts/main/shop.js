(function ($) {

  var FAV_KEY = "picklete_fav";

  // if ('ontouchstart' in document.documentElement) {
  //   // if mobile we we use a backdrop because click events don't delegate
  //   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
  // }

  // add to favorite
  $(".container").on("click", ".item-like, .label-like", function (e) {
    e.preventDefault();

    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;
    var favs = Cookies.getJSON(FAV_KEY) || {};
    var productId = $(target).attr("data-productId");

    if ($(target).hasClass("active")) {
      $(target).removeClass("active");

      if (favs[productId]) {
        favs[productId] = null;
        delete favs[productId];
      }
    } else {
      $(target).addClass("active");
      favs[productId] = true;
    }

    Cookies.set(FAV_KEY, favs, { expires: 2592000 });

    $.ajax({
      url : '/favorite/add',
      type: "post",
      success:function(data, textStatus, jqXHR)
      {
        console.log(data);
      },
      error: function (jqXHR, exception) {
        console.log(jqXHR);
      }
    });

  });

  // remove from favorite list
  $(".container").on("click", ".fav-item-move", function (e) {
    e.preventDefault();
    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;
    var favs = Cookies.getJSON(FAV_KEY) || {};
    var productId = $(target).attr("data-productId");

    if (favs[productId]) {
      favs[productId] = null;
      delete favs[productId];
    }

    Cookies.set(FAV_KEY, favs, { expires: 2592000 });
    $(target).parent().parent().remove();

  });



  var travelFavorite = function () {

    var favs = Cookies.getJSON(FAV_KEY) || {};
    var target = $(".label-like");
    if (target) {
      var productId = target.attr("data-productId");
      if (favs[productId])
        target.addClass("active");
    }

    for (prop in favs) {
      var target = $(".item-like[data-productId=" + prop + "]");
      if (target)
        target.addClass("active");
    }

  };

  travelFavorite();

  // add to cart
  $(".container").on("click", ".add-to-cart", function (e) {
    e.preventDefault();
    console.log('add to cart');

    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {orderItems: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    var productGmId = $(this).attr("data-productGmId");
    var productId = $(this).attr("data-productId");
    var quantity = $('input[name="quant[1]"]').val() || 1;
    var price = $(this).attr("data-price");
    var photos = JSON.parse($(this).attr("data-photos"));
    var brand = $(this).attr("data-brand");
    var brandname = $(this).attr("data-brandname") || "";
    var name = $(this).attr("data-name") || "";
    var originPrice = $('#originPrice').text();
    var packable;
    var expressable;

    if($("#service-3").hasClass('disabled'))
      packable = false;
    else
      packable = true;

    if($("#service-2").hasClass('disabled'))
      expressable = false;
    else
      expressable = true;

    var stockQuantity = $("input[type='text'][min='1']").attr('max');

    console.log('=== picklete_cart ===', picklete_cart);
    console.log('=== productId ===', productId);
    console.log('=== quantity ===', quantity);
    console.log('=== price ===', price);
    console.log('=== packable ===',packable);
    console.log('=== stockQuantity ===',stockQuantity);

    var addProduct = {
      productGmId: productGmId,
      ProductId: productId,
      quantity: quantity,
      brandname: brandname,
      price: price,
      brand: brand,
      name: name,
      photos: photos,
      originPrice: originPrice,
      packable: packable,
      expressable: expressable,
      stockQuantity: stockQuantity
    }

    // check product is added, it will added to same data
    var isTheSame = false;
    for(var orderItem of picklete_cart.orderItems) {
      if(orderItem.ProductId == addProduct.ProductId) {
        isTheSame = true;
        orderItem.quantity = (parseInt(orderItem.quantity,10) + parseInt(addProduct.quantity,10)).toString();
        break;
      }
    }

    if( !isTheSame ) {
      picklete_cart.orderItems.push(addProduct);
    }

    Cookies.set('picklete_cart', picklete_cart);
    dropdownCartInit();

  });

  var dropdownCartInit = function(){

    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {orderItems: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    $('#order-items-count').text(picklete_cart.orderItems.length);
    var dropdownCart = $('#dropdown-cart-content');

    dropdownCart.empty();

    var totalPrice = 0;

    picklete_cart.orderItems.forEach(function(orderItem){
      var price = parseInt(orderItem.price, 10);
      if(orderItem.stockQuantity <= 0){
        alert(orderItem.name + '商品數項已售完，請至購物車修改');
      }
      var liOrderItem =
        '<li>' +
        '  <div class="row">' +
        '    <div class="col-xs-4">' +
        '      <div class="item-block">' +
        '        <span class="badge">'+orderItem.quantity+'</span>' +
        '        <img src="'+orderItem.photos[0]+'" class="img-full">' +
        '      </div>' +
        '    </div>' +

        '    <div class="col-xs-8 p-left-0">' +
        '      <h6 class="text-muted"><a href="/brands">'+orderItem.brandname+'</a></h6>' +
        '      <h5><a href="/shop/products/'+orderItem.productGmId+'/'+orderItem.ProductId+'">' + orderItem.name + '</a></h5>' +
        '      <h5>$ '+ price.formatMoney() +'</h5>' +
        '    </div>' +
        '  </div>' +
        '</li>';

      totalPrice += parseInt(orderItem.price*orderItem.quantity, 10);

      dropdownCart.append(liOrderItem);

    });

    var liEnd =
      '<li>' +
      '  <div class="row">' +
      '    <div class="col-xs-6">' +
      '      <h2 class="text-center text-black line-height-small m-top-0 m-bottom-0">$ '+ totalPrice.formatMoney() +'<br><small class="font-size-50">subtotal</small></h2>' +
      '    </div>' +
      '    <div class="col-xs-6"><a href="/user/cart" class="btn btn-black border-radius-circle btn-block">結帳</a></div>' +
      '  </div>' +
      '</li>';

    dropdownCart.append(liEnd);
  };

  dropdownCartInit();

  // if($("#verification").attr("data-verification")){
  //   $(this).notifyMe(
  //     'top',
  //     'cart',
  //     '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>帳號已開通',
  //     '',
  //     500,
  //     3000
  //   );
  // }

}(jQuery));
