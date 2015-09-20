(function ($) {
  $('.dpt').on("click", function(e){
    var e = $(event.currentTarget);
    //正式上線後要依據大館別固定數量更改
    for(i=1; i<=9; i++) {
      document.getElementById('subDpt' + i).className="tab-pane fade";
      $('.productDptId'+i).css("display","none");
    }
    document.getElementById('subDpt' + e.data('id')).className="tab-pane fade in active";
    $('.productDptId'+e.data('id')).css("display","block");
  });

  $(".container").on("click", ".item-like, .label-like", function (e) {
    e.preventDefault();

    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;

    if ($(target).hasClass("active"))
      $(target).removeClass("active");
    else
      $(target).addClass("active");
  });


  $(".container").on("click", ".add-to-cart", function (e) {
    e.preventDefault();
    console.log('add to cart');

    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {products: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    var productId = $(this).attr("data-productId");
    var quantity = $('input[name="quant[1]"]').val();
    var price = $('#price').text();


    console.log('=== picklete_cart ===', picklete_cart);
    console.log('=== productId ===', productId);
    console.log('=== quantity ===', quantity);
    console.log('=== price ===', price);

    addProduct = {
      id: productId,
      quantity: quantity,
      price: price
    }

    picklete_cart.products.push(addProduct);
    Cookies.set('picklete_cart', picklete_cart);

  });






}(jQuery));
