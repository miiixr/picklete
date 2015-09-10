(function ($) {
  var inputName;
  var that;
  $(document).on('change.bs.fileinput', '.fileinput', function (e) {

    // console.log(e);
    // console.log("click from select");
    inputName = $(this).find('input[name="uploadfile"]').data('name');
    that = $(this).parent();
    // console.log('-----');
    // console.log(inputName);
    // console.log(that);
    // console.log('-----');    
    var $form = $(this).find("form");
    $form.ajaxSubmit(options);
  });

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      // console.log(formData);   
      // var queryString = $.param(formData);
    },
    success: function (responseText, statusText, xhr, $form)  {
      // console.log(responseText);
      // console.log(statusText);
      if(statusText == 'success') {
        that.find('input[name="'+inputName+'"]').val(responseText[0].fd);
        // console.log('-----');
        // console.log(responseText[0].fd);
        // console.log('-----');
      }
    }
  };

  // $('form#brand-avatar').submit(function() {
  //   return false;
  // });
}(jQuery));
