(function ($) {

  var FAV_KEY = "picklete_fav";

  $('.dpt').on("click", function(e){
    var e = $(event.currentTarget);
    //正式上線後要依據大館別固定數量更改
    for(i=1; i<=9; i++) {
      document.getElementById('subDpt' + i).className="tab-pane fade";
    }
    document.getElementById('subDpt' + e.data('id')).className="tab-pane fade in active";
    $('.tab-pane.fade.in.active').css("display","none");
    $('.tab-pane.fade.in.active').fadeIn();

  });

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

    Cookies.set(FAV_KEY, favs, { expires: 90 });

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

    Cookies.set(FAV_KEY, favs, { expires: 90 });
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

    var productId = $(this).attr("data-productId");
    var quantity = $('input[name="quant[1]"]').val() || 1;
    var price = $('#price').text();
    var photos = JSON.parse($(this).attr("data-photos"));
    var brand = $(this).attr("data-brand");
    var name = $(this).attr("data-name") || "";



    console.log('=== picklete_cart ===', picklete_cart);
    console.log('=== productId ===', productId);
    console.log('=== quantity ===', quantity);
    console.log('=== price ===', price);

    var addProduct = {
      ProductId: productId,
      quantity: quantity,
      price: price,
      brand: brand,
      name: name,
      photos: photos
    }

    picklete_cart.orderItems.push(addProduct);
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
        '      <h6 class="text-muted"><a href="/brands">'+orderItem.brand+'</a></h6>' +
        '      <h5><a href="shop-product">'+orderItem.name+'</a></h5>' +
        '      <h5>$ '+orderItem.price+'</h5>' +
        '    </div>' +
        '  </div>' +
        '</li>';

      totalPrice += parseInt(orderItem.price, 10);

      dropdownCart.append(liOrderItem);


    });


    var liEnd =
      '<li>' +
      '  <div class="row">' +
      '    <div class="col-xs-6">' +
      '      <h2 class="text-center text-black line-height-small m-top-0 m-bottom-0">$ '+totalPrice+'<br><small class="font-size-50">subtotal</small></h2>' +
      '    </div>' +
      '    <div class="col-xs-6"><a href="/user/cart" class="btn btn-black border-radius-circle btn-block">結帳</a></div>' +
      '  </div>' +
      '</li>';

    dropdownCart.append(liEnd);


    console.log('=== dropdownCartInit finish ===');


  }

  console.log('===========');
  dropdownCartInit();






}(jQuery));
