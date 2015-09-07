(function ($) {

  $("#searchSubmit").bind("click", function() {
    var a_href = $("#searchSubmit").attr('href');
    $.ajax({
        url: a_href,
        data: $('#submitData').serialize(),
        type: 'get',
        dataType: 'json',
        success: function(result) {
            alert('!!');
        }
    });
  });

}(jQuery));