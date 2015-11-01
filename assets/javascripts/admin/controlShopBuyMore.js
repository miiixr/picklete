$(function() {
  var $a_tab1 = $('#a-tab1');
  var $a_tab2 = $('#a-tab2');
  var $tab_container = $('#tab-container');
  // $tab_container.data('tabStatus');
  if ($tab_container.data('tab-status') == 2)
    $a_tab2.click();

  // $a_tab1.onClick(function() {
  //
  // });
  // $a_tab2.onClick(function() {
  //
  // });

  $('form').submit(function() {
    var $inputTabStatus = $("<input>")
      .attr("type", "hidden")
      .attr("name", "tabStatus").val(2);

    var a_tab2_class = $a_tab2.parent().attr('class') ? $a_tab2.parent().attr('class') : '';
    if (a_tab2_class.indexOf('active'))
      $inputTabStatus = $inputTabStatus.val(1);

    $(this).append($inputTabStatus);
    return true;
  });

  // pagination 2
  // for new style, that can jump to sepcific page.
  var formWithPagination2 = $('form.with-pagination2');
  // page number current
  var inputPage = $('input[name=limitPage]', formWithPagination2);
  // total page number
  var inputTotalPages = $('input[name=totalPages]', formWithPagination2);
  // each page how many items
  var inputLimit = $('input[name=limit]', formWithPagination2);

  $('.form-control', formWithPagination2).change(function() {
    inputPage.val(0);
  });

  $('#pagination2-limit').change(function() {
    inputPage.val(0);
    inputLimit.val($(this).val());
    formWithPagination2.submit();
  });

  // for new style, that can jump to sepcific page.
  $('.pagination2-jump').on('click', function(e) {
    e.preventDefault();

    var page = (parseInt($(this).data('page'), 0) - 1) || 0;
    page = (page < 0) ? 0 : page;

    inputPage.val(page);
    formWithPagination2.submit();
    return false;
  });

  $('#pagination2-next').click(function(e) {
    e.preventDefault();

    var page = parseInt(inputPage.val(), 0) + 1;
    var totalPages = parseInt(inputTotalPages.val(), 0);

    if (page >= totalPages) {
      page = totalPages - 1;
    }

    inputPage.val(page);
    formWithPagination2.submit();

    return false;
  });

  $('#pagination2-prev').click(function(e) {
    e.preventDefault();
    var page = parseInt(inputPage.val(), 0) - 1;

    //page = (page <= 0) ? 0 : page;
    if (page < 0) {
      page = 0;
    }

    inputPage.val(page);
    formWithPagination2.submit();

    return false;
  });


  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      var id = that.parent().find('input[type="hidden"]').val();
      var url = '/api/buymore/delete/' + id;
      $.post(url,{id: id},function(result){
        location.reload();
      });
    });
  });

});
