$(function  () {

	var sliderlocation = $('#myscript').attr("slider-location");
	var id = $('#myscript').attr("slider-id");

  $("input[value='"+sliderlocation+"']").prop('checked', true);

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    $('#modal-delete').on('click','.btn-green',function(e){
    	e.preventDefault();
    	var url = '/api/slider/delete/' + id;
      $.post(url, {id: id}, function(result){
        location.href = '/admin/index-slider';
      });
    });
  });

	$('form#activeCreateForm').submit(function(event) {
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
	
});
