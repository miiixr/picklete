(function ($) {

  $(".fileinput").on('change.bs.fileinput', function (e) {
    console.log(e);
    console.log("click from select");
    $('form#brand-avatar').ajaxSubmit(options);
  });

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      console.log(formData);
      // var queryString = $.param(formData);
    },
    success: function (responseText, statusText, xhr, $form)  {
      console.log(responseText);
    }
  };

  $('form#uploadForm').submit(function() {
    return false;
  });
}(jQuery));
