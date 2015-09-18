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

  $("input[value=#{slider.location}]").prop('checked', true);

});
