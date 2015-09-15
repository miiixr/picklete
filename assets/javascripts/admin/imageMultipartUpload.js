(function ($) {
  var inputName;

  var that;
  $(document).on('change.bs.fileinput', '.fileinput', function (e) {
    that = $(e.currentTarget || this);
    inputName = that.find('input[name="uploadfile"]').data('name');

    console.log(that.find('input[name="filename"]').val());
    var $form = that.find("form");
    // change file path
    $form.attr("action", "/admin/image/upload?" + $form.serialize());
    $form.ajaxSubmit(options);
  });

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      var queryString = $.param(formData);
    },
    success: function (responseText, statusText, xhr, $form)  {
      if(statusText == 'success') {
        that.find('input[name="' + responseText.filename + '"]').val(responseText[0].fd);
      }
    }
  };
}(jQuery));
