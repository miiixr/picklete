$(function  () {
  
  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      var id = that.parent().find('input[type="hidden"]').val();
      var url = '/api/shop-code/delete/' + id;
      $.post(url,{id: id},function(result){
        location.reload();
      });
    });
  });

});
