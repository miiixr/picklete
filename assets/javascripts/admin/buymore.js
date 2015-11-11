$(function() {

  $('.addSelect').prop('checked', false);
  
  $('.selectAll').on('click', function () {
    var status = $(this).prop('checked');
    if (status === true) {
      $('.addSelect:not(:disabled)').prop('checked', true);
    } else {
      $('.addSelect').prop('checked', false);
    }

  });


});