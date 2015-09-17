(function ($) {	
	$('.delete.FAQ').click(function(event){
    var e = $(event.currentTarget);
    var targetName = e.data('name');
    var deleteNode = $('#modal-FAQ-delete');
    document.getElementById('del-FAQ-id').value = e.data('id');
    deleteNode.find(".FAQTitle").html(targetName);
    deleteNode.modal('show');
	 });
}(jQuery));