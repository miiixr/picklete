(function ($) {
  var userRegister = function(that) {

    $.ajax({
      type: 'post',
      url: $(that).attr('action'),
      data: $(that).serialize(),
      dataTypes: 'html',
      success:function(data, textStatus, jqXHR){
        console.log(data);
        if (data.status == "ok") {
          $(that).notifyMe(
            'top',
            'cart',
            // '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>記得去收驗證信喔!!',
            '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>恭喜帳號註冊成功!!',
            '',
            300,
            1500
          );
          window.location.replace("/shop/products");
        }else{
          $(that).notifyMe(
            'top',
            'cart',
            '<span class="glyphicon glyphicon-remove-circle m-right-2"></span>表單送出填寫有誤，請確認填入資料',
            '',
            200,
            2000
          );
        }
      }
    });
  };

  $('#twzipcode').twzipcode({
    // 'zipcodeIntoDistrict': true,
    'countyName'   : 'city',
    'districtName' : 'region',
    'zipcodeName'  : 'zipcode',
    'css': [
      'form-control width-auto inline-block',
      'form-control width-auto inline-block',
      'form-control width-auto inline-block']
  });

  $("select[name='city']").prop('required',true);
  $("select[name='region']").prop('required',true);
  $("select[name='zipcode']").prop('required',true);

  $("#registerForm").on('submit', function(e) {
    e.preventDefault();
    if($("#password").val() != $("#passwordCheck").val()){
      $("#passwordCheck").focus();
      return alert('前後密碼請一致');
    }
    else if($("#password").val().length <6){
      $("#password").focus();
      return alert('密碼太短');
    }
    else{
      // $(this).off('submit');
      // $(this).submit();

      var email = $("#user-email");
      var that = this;

      $.get('/api/user/verify/' + email.val())
      .done(function (data) {
        if (data.result !== 'ok') {
          email.focus();
          return alert('Email 已經被註冊使用 或格式錯誤！');
        }

        $(that).notifyMe(
          'top',
          'cart',
          '<span class="glyphicon glyphicon-remove-circle m-right-2"></span>帳號資料註冊中 ...',
          '',
          200,
          2000
        );
        return userRegister(that);
      });
      return false;
    }
  });

}(jQuery));
