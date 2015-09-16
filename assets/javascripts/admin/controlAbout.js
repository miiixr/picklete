(function ($) {

  $('.well').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    // console.log(that);
    var s = $(that.parent().parent()).prop('outerHTML');
    // replace index
    var index;
    if (index = s.match(/good\[\d/)) {
      index = index[0].match(/\d/)[0];
      index = parseInt(index, 10) + 1;
      s = s.replace(/good\[\d/g, "good[" + index);
    }
    that.parent().parent().after(s);
    that.remove();
  });

  // add remove function
  $('.row').on('click','.btn-remove',function(e){
    e.preventDefault();
    var that = $(this);
    if( ! that.next().hasClass("btn-add")){
      that.parent().parent().remove();
    }
  });

}(jQuery));

