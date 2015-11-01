$(function() {
  var formWithPagination = $('form.with-pagination');
  // page number current
  var inputPage = $('input[name=page]', formWithPagination);
  // total page number
  var inputTotalPages = $('input[name=totalPages]', formWithPagination);
  // each page how many items
  var inputLimit = $('input[name=limit]', formWithPagination);

  $('.form-control', formWithPagination).change(function() {
    inputPage.val(0);
  });

  $('#pagination-limit').on('change', function() {
    inputPage.val(0);
    inputLimit.val($(this).val());
    console.log('hello')
    formWithPagination.submit();
  });

  // for new style, that can jump to sepcific page.
  $('.pagination-jump').on('click', function (e) {
    e.preventDefault();

    var page = (parseInt($(this).data('page'), 0) - 1) || 0;
    page = (page < 0) ? 0 : page;

    inputPage.val(page);
    formWithPagination.submit();
    return false;
  });

  $('#pagination-next').click(function(e) {
    e.preventDefault();

    var page = parseInt(inputPage.val(), 0) + 1;
    var totalPages = parseInt(inputTotalPages.val(), 0);

    if (page >= totalPages) {
      page = totalPages - 1;
    }

    inputPage.val(page);
    formWithPagination.submit();

    return false;
  });

  $('#pagination-prev').click(function(e) {
    e.preventDefault();
    var page = parseInt(inputPage.val(), 0) - 1;

    //page = (page <= 0) ? 0 : page;
    if (page < 0) {
      page = 0;
    }

    inputPage.val(page);
    formWithPagination.submit();

    return false;
  });


  var displayPageHandler = function () {
    var totalNumber = parseInt(inputTotalPages.val(), 10) + 1;
    var pageNumber = parseInt(inputPage.val(), 10) + 1;
    var PAGE_NUMBER = 5;

    var pageNodes = $(".pagination .pagination-jump");
    pageNodes.hide();

    var currentPlus = parseInt(pageNumber / PAGE_NUMBER, 10);

    if (currentPlus <= 0) {
      for (var i=0; i < PAGE_NUMBER; i++) {
        $(pageNodes[i]).show();
      }
      return;
    }

    if (pageNumber % PAGE_NUMBER == 0) {
      $(pageNodes[(PAGE_NUMBER * currentPlus) -1]).show();
    }

    var plusNumber = (currentPlus + 1) * PAGE_NUMBER;
    var total = (plusNumber >= totalNumber) ? totalNumber : plusNumber;
    for (var i=plusNumber - PAGE_NUMBER; i < total; i++) {
      $(pageNodes[i]).show();
    }
    return;
  };

  displayPageHandler();

});
