$('.col-sm-9').on('click','.btn-add',function(e){
  e.preventDefault();
  var that = $(this);
  var s = $(that.parent().parent().parent()).prop('outerHTML');
  that.parent().parent().parent().after(s);
  that.remove();
});
$(function  () {
  $("ul.list-brand").sortable();
});
