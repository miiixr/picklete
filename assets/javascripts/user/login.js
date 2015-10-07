(function ($) {

  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    var that = $(this);
    var action = that.attr("action");
    console.log(that);
    console.log(action);


    // console.log(that.find("input[name=identifier]"));
    // console.log(that.find("input[name=password]"));

    $.post(action, {
      identifier: that.find("input[name=identifier]").val(),
      password: that.find("input[name=password]").val()
    }, function (result) {

      console.log(result);

      if (result.status == "ok") {
        return window.location.reload();
      } else {
        return alert("登入錯誤，請檢查帳號密碼是否填寫正確！");
      }
    });
  });

  $('#forgotPassword').submit(function() {
    $.ajax({
        type: 'get',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success:function(data, textStatus, jqXHR){
          console.log('=== data ==>',data);
          alert(data);
          window.location.reload();
        },
        error: function(data, textStatus, jqXHR){
          console.log('=== data ==>',data);
          alert("請再次確認信箱!");
        }
    })
    return false;
  });


}(jQuery));
