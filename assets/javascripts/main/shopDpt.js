(function ($) {

  $.urlParam = function(name) {
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results ? results[1] : false;
  };

  var dptDisplay = function (id) {
    //正式上線後要依據大館別固定數量更改
    for(i=1; i<=9; i++) {
      var node = document.getElementById('subDpt' + i);
      if(node) node.className="tab-pane fade";
    }
    document.getElementById('subDpt' + id).className="tab-pane fade in active";
    $('.tab-pane.fade.in.active').css("display", "none");
    $('.tab-pane.fade.in.active').fadeIn();
  }

  $('.dpt').on("click", function(e){
    var e = $(event.currentTarget);
    var id = e.data('id');
    dptDisplay(id);
  });

  // when page loaded, execute init
  var activeDptHandler = function () {
    var keys = window.location.search.replace('?', '').split('&');
    var params = {};
    var ACTIVE_CLASS_NAME = 'active';

    $.each(keys, function (idx, val) {
      var item = val.split('=');
      params[item[0]] = item[1];
    });

    $('.dpt.active').removeClass(ACTIVE_CLASS_NAME)
    $('li.active.subDpt').removeClass(ACTIVE_CLASS_NAME);
    
    // when brand query, not dpt to active
    if (params.brand) return;

    // when nothing to query, means first item active
    if (! params.dptId || params.dptId == '') {
      dptDisplay(1);
      $('.dpt[data-id="1"]').addClass(ACTIVE_CLASS_NAME);
      $('#subDpt1 .subDpt:eq(0)').addClass(ACTIVE_CLASS_NAME);
      return;
    }

    dptDisplay(params.dptId);
    $('.dpt[data-id="' + params.dptId + '"]').addClass(ACTIVE_CLASS_NAME);

    if ( ! params.dptSubId)
      $('#subDpt' + params.dptId + ' .subDpt:eq(0)').addClass(ACTIVE_CLASS_NAME);
    else
      $('#subDpt' + params.dptId + ' .subDpt[data-id="' + params.dptSubId + '&sort="]').addClass(ACTIVE_CLASS_NAME);

  };
  activeDptHandler();



  $('.filterMenu a').on('click', function (e) {
    e.preventDefault();
    var target = $(this);
    var targetQuery = target.attr('href').replace('?', '');
    var search = location.search;
    var url = location.href;
    if (search == '') {
      return window.location.href = window.location.href + '?' + target.attr('href');
    }

    url = url.replace(/&sort=\w*&/g, '&');
    url = url.replace(/&sort=\w*/g, '&');
    url = url.replace(/&color=\w*/g, '&');
    url = url.replace(/&color=\w*&/g, '&');

    return window.location.href = url + '&' + targetQuery;
  });
}(jQuery));