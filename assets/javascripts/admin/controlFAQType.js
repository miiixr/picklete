(function ($) {
	$('.col-sm-9').on('click','.btn-add',function(e){
	  e.preventDefault();
	  var that = $(this);
	  var s = $(that.parent().parent().parent()).prop('outerHTML');
	  that.parent().parent().parent().after(s);
	  that.remove();
	});
	// $(function  () {
	//   $("ul.list-brand").sortable();
	// });
	$('.delete.FAQType').click(function(event){
    var e = $(event.currentTarget);
    var targetName = e.data('name');
    var deleteNode = $('#modal-FAQType-delete');
    document.getElementById('del-FAQType-id').value = e.data('id');
    deleteNode.find(".FAQTypeTitle").html(targetName);
    deleteNode.modal('show');
	 });
}(jQuery));
