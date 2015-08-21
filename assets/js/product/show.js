$(function() {
  $("#productDeleteButton").bind("click", function() {
    var a_href = $("#productDeleteButton").attr('href');
    $.ajax({
        url: a_href,
        type: 'DELETE',
        success: function(result) {
            // Do something with the result
        }
    });
  });
});
