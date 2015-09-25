$(function() {
  var formWithPagination = $('form.with-pagination');
  var inputPage = $('input[name=page]', formWithPagination);
  var inputLimit = $('input[name=limit]', formWithPagination);

  $('.form-control', formWithPagination).change(function() {
    inputPage.val(0);
  });

  $('#pagination-limit').change(function() {
    inputPage.val(0);
    inputLimit.val($(this).val());
    formWithPagination.submit();
  });

  $('#pagination-next').click(function() {
    inputPage.val(parseInt(inputPage.val()) + 1);
    formWithPagination.submit();
  });

  $('#pagination-prev').click(function() {
    inputPage.val(parseInt(inputPage.val()) - 1);
    formWithPagination.submit();
  });
});
