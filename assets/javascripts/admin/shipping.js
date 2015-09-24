(function ($) {

  // btn-add
  $('.well').on('click','.btn-add',function(e){
    // alert('clicked!');
    e.preventDefault();
    var that = $(this);
    // console.log(that);
    var s = $(that.parent().parent()).prop('outerHTML');
    // replace index
    var index;
    if (index = s.match(/shippings\[\d/)) {
      index = index[0].match(/\d/)[0];
      index = parseInt(index, 10) + 1;
      s = s.replace(/shippings\[\d/g, "shippings[" + index);
    }
    that.parent().parent().after(s);
    that.remove();
  });
  // end btn-add

  // btn-remove
  $('.row').on('click','.btn-remove',function(e){
    // alert('clicked!');
    e.preventDefault();
    var that = $(this);
    console.log('=== that.context.previousElementSibling is ==>',that.context.previousElementSibling);
    console.log('=== that.context.nextElementSibling is ==>',that.context.nextElementSibling);
    if(that.context.nextElementSibling == null){
      that.parent().parent().remove();
    }
  });
  // end btn-remove


  // form submit
  $(function  () {
    $("form#shippingForm").submit(function() {

      console.log($(this).serialize());

    });
  });
  // end form submit

}(jQuery));
