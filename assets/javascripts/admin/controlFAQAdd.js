(function ($) {

  var answer = CKEDITOR.replace('answer');

  $("#FAQForm").on('submit', function(e) {
    if($("#title").val() == "" || answer.getData()=="" ){
      e.preventDefault();
      alert('請填妥所有欄位');
      return false;
    }
    else{
      return true;
    }

  });



}(jQuery));
