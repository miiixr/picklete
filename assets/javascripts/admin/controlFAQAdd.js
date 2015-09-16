(function ($) {

  $("#FAQForm").on('submit', function(e) {
    e.preventDefault();
    if($("#title").val()=="" | $("#answer").val()=="" ){
      return alert('請填妥所有欄位');
    }
    else{
      $(this).off('submit');
      $(this).submit();
    }

  });

}(jQuery));
