(function ($) {

	$('#deleteBrand').click(function(event){
    var e = $(event.currentTarget);
    var targetName = e.data('name');
    var deleteNode = $('#modal-brand-delete');
    document.getElementById('brandId').value = e.data('id');
    deleteNode.find(".brandName").html(targetName);
    deleteNode.modal('show');
  });
}(jQuery));