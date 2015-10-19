(function ($) {

  $('.well').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    // console.log(that);
    var s = $(that.parent().parent()).prop('outerHTML');
    // replace index
    var index;
    index = s.match(/src=\"[^\"]*\"/);
    index = "src='http://fakeimg.pl/1000x1000/dddddd/FFF/?text=800x800'";
    s = s.replace(/src=\"[^\"]*\"/,index);
    
    index = s.match(/name\=\"dealerNames\[\]\" value\=\"[^\"]*\"/);
    index = "name\=\"dealerNames\[\]\"";
    s = s.replace(/name\=\"dealerNames\[\]\" value\=\"[^\"]*\"/,index);
    
    index = s.match(/\<input type\=\"hidden\" name\=\"dealerPhotos\[\]\" form\=\"about\-data\" value\=\"[^\"]*\"/);
    index = "\<input type\=\"hidden\" name\=\"dealerPhotos\[\]\" form\=\"about\-data\" value\=\"\"";
    s = s.replace(/\<input type\=\"hidden\" name\=\"dealerPhotos\[\]\" form\=\"about\-data\" value\=\"[^\"]*\"/,index);
    
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

