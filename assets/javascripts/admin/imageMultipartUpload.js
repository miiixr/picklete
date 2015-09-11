(function ($) {
  var inputName;
  var that;
  $(document).on('change.bs.fileinput', '.fileinput', function (e) {

    that = $(e.currentTarget || this);
    inputName = that.find('input[name="uploadfile"]').data('name');

    var $form = that.find("form");
    $form.ajaxSubmit(options);
  });

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      // console.log(formData);   
      // var queryString = $.param(formData);
    },
    success: function (responseText, statusText, xhr, $form)  {
      console.log(responseText);
      console.log(statusText);
      if(statusText == 'success') {
        console.log(inputName);
        that.find('input[name="' + responseText.filename + '"]').val(responseText[0].fd);
      }
    }
  };
}(jQuery));
