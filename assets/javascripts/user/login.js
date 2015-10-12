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
        if(!result.isVerification){
          $('#modal-login').modal('hide');
          $('#verificationMailEmail').val(result.email);
          $('#modal-verification').modal('show');
        }else{
          return window.location.reload();
        }
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
          $('#modal-password').modal('hide')
          $(this).notifyMe(
            'top',
            'cart',
            '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>已寄出mail，請至信箱確認',
            '',
            300,
            1500
          );
        },
        error: function(data, textStatus, jqXHR){
          console.log('=== data ==>',data);
          $(this).notifyMe(
            'top',
            'cart',
            '<span class="glyphicon glyphicon-remove-circle m-right-2"></span>請再次確認信箱!',
            '',
            300,
            1500
          );
        }
    })
    return false;
  });

  $('#verificationMailAgain').submit(function() {
    $.ajax({
        type: 'get',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success:function(data, textStatus, jqXHR){
          console.log('=== data ==>',data);
          $('#modal-verification').modal('hide')
          $(this).notifyMe(
            'top',
            'cart',
            '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>信件已寄出',
            '',
            300,
            1500
          );
        },
        error: function(data, textStatus, jqXHR){
          console.log('=== data ==>',data);
          $(this).notifyMe(
            'top',
            'cart',
            '<span class="glyphicon glyphicon-remove-circle m-right-2"></span>請稍候再試',
            '',
            300,
            1500
          );
        }
    });
    return false;
  });

}(jQuery));
