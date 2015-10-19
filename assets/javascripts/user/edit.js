(function ($) {

  $("#user-email").change(function(){
    $.get('/api/user/verify/' + $("#user-email").val())
    .done(function (data) {
      if (data.result !== 'ok') {
        return alert('Email 已經被註冊使用 或格式錯誤！');
      }
    });
  });
}(jQuery));
