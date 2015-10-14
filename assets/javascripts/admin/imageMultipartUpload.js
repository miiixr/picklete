(function ($) {
  var inputName;
  var that;
  var $container;
  var $origInput;
  var $form;

  var options = {
    beforeSubmit:  function (formData, jqForm, options) {
      var queryString = $.param(formData);

      that.find('input[name="' + inputName + '"]')
        .val('')
        .data('uploadStatus', 'uploading');

      console.log('iN:'+inputName);
    },
    success: function (responseText, statusText, xhr, $form)  {
      if (statusText == 'success') {
        that.find('input[name="' + inputName + '"]')
          .val('')
          .data('uploadStatus','uploaded');

        that.find('input[name="' + responseText.filename + '"]').val(responseText[0].fd);
      }

      if ($container && $origInput) {
        $container.append($origInput);
        $origInput = $container = null;
      }

      if ($form.hasClass('remove-after-submit')) {
        $form.detach();
      }
    }
  };

  $(document).on('change.bs.fileinput', '.fileinput', function (e) {
    that = $(e.currentTarget || this);

    inputName = that.find('input[name="uploadfile"]').data('name');

    $form = that.find("form");

    if ($form.size() == 0) {

      //var inlineForm = that.find(".inline-file-form");

      $form = $('<form action="/admin/image/upload" method="POST" enctype="multipart/form-data" class="remove-after-submit" />');

      $form.append(
        $('<input type="hidden" />')
          .attr('name', 'filename')
          .val(
            $('input[name="filename"]', that).val()
          )
      );

      $form.append(
        $('<input type="hidden" />')
          .attr('name', 'width')
          .val(
            $('input[name="width"]', that).val()
          )
      );

      $form.append(
        $('<input type="hidden" />')
          .attr('name', 'height')
          .val(
            $('input[name="height"]', that).val()
          )
      );

      $origInput = $('input[name="uploadfile"]', that);
      $container = $origInput.parent();

      $form.append(
        $origInput
      );

      $('body').append($form);

      //todo remove form after uploaded
    }

    // change file path
    $form.attr("action", "/admin/image/upload?" + $form.serialize());
    $form.ajaxSubmit(options);
  });


}(jQuery));
