(function ($) {

  // click add a 閃購 button
  $(".btn.btn-green.btn-lg").click(function() {
    // alert('閃購 add button clicked!')
    // var className = $(this).find( "label:first" ).attr('class');
    // var id = $(this).attr('id');
    // var path = "/product/unpublish/" + id;
    // $.ajax({
    //   type: "PUT",
    //   url: path
    // });
  });
  // end click add a 閃購 button


  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      var id = that.parent().find('input[type="hidden"]').val();
      var url = '/api/shopDiscount/delete/' + id;
      $.post(url,{id: id},function(result){
        location.reload();
      });
    });
  });

}(jQuery))
