(function ($) {

	$('#deleteBrand').click(function(event){
    var e = $(event.currentTarget);
    var targetName = e.data('name');
    var deleteNode = $('#modal-brand-delete');
    document.getElementById('brandId').value = e.data('id');
    deleteNode.find(".brandName").html(targetName);
    deleteNode.modal('show');
  });

	$('#brand-data').submit(function(event) {
		/* Act on the event */
		var pass = true;
		// check image is uploading or not
    $('input').map(function(index) {
      if( $(this).data('uploadStatus') == 'uploading') {
        alert('尚有圖片在上傳中');
        pass = false;
      }
    });
		return pass;
	});
}(jQuery));
