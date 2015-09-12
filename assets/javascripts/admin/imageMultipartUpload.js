(function ($) {
  var inputName;
  $("input.fileInput").on('change.bs.fileinput', function (e) {
    // console.log(e);
    // console.log("click from select");
    inputName = $(this).data('name');
    var $form = $(this).parents("form").first();
    console.log($form);
    $form.ajaxSubmit(options);
  });

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      console.log(formData);
      // var queryString = $.param(formData);
    },
    success: function (responseText, statusText, xhr, $form)  {
      console.log(responseText);
      console.log(statusText);
      if(statusText == 'success') {
        $('input[name="'+inputName+'"]').val(responseText);
      }
    }
  };

  // $('form#brand-avatar').submit(function() {
  //   return false;
  // });
}(jQuery));
