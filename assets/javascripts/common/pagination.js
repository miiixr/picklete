$(function() {
  var formWithPagination = $('form.with-pagination');
  // page number current
  var inputPage = $('input[name=page]', formWithPagination);
  // each page how many items
  var inputLimit = $('input[name=limit]', formWithPagination);

  $('.form-control', formWithPagination).change(function() {
    inputPage.val(0);
  });

  $('.pagination-limit').change(function() {
    inputPage.val(0);
    inputLimit.val($(this).val());
    formWithPagination.submit();
  });

  // for new style, that can jump to sepcific page.
  $('.pagination-jump').on('click', function (e) {
    e.preventDefault();
    var page = (parseInt($(this).data('page'), 10) - 1) || 0;
    page = (page < 0) ? 0 : page;

    inputPage.val(page);
    formWithPagination.submit();
    return false;
  });

  $('#pagination-next').click(function(e) {
    e.preventDefault();

    var page = parseInt(inputPage.val(), 10) + 1;

    inputPage.val(page);
    formWithPagination.submit();

    return false;
  });

  $('#pagination-prev').click(function(e) {
    e.preventDefault();
    var page = parseInt(inputPage.val(), 10) - 1;
    page = (page <= 0) ? 0 : page;

    inputPage.val(page);
    formWithPagination.submit();

    return false;
  });
});
