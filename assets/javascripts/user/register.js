$(window).load(function() {

  console.log('=== up ===');
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

  $("#registerForm").on('submit', function(e) {
    e.preventDefault();
    if($("#password").val() != $("#passwordCheck").val()){
      return alert('前後密碼請一致');
    }
    else if($("#password").val().length <6){
      return alert('密碼太短');
    }
    else{
      // $(this).off('submit');
      // $(this).submit();
      $.ajax({
          type: 'post',
          url: $(this).attr('action'),
          data: $(this).serialize(),
          dataTypes: 'html',
          success:function(data, textStatus, jqXHR){
            console.log(data);
            if (data.status == "ok") {
              $(this).notifyMe(
                'top',
                'cart',
                '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>記得去收驗證信喔!!',
                '',
                300,
                1500
              );
              window.location.replace("/shop/products");
            }else{
              $(this).notifyMe(
                'top',
                'cart',
                '<span class="glyphicon glyphicon-remove-circle m-right-2"></span>表單送出填寫有誤，請確認填入資料',
                '',
                200,
                2000
              );
            }
          }
      })
      return false;
    }
  });


});
