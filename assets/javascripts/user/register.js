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
              alert("記得去收驗證信喔");
              window.location.replace("/shop/products");
            }else{
              $(this).notifyMe(
                'top', // Position
                'error', // Type
                'Lorem Ipsum Text', // Title
                'Lorem Ipsum is simply dummy text of the printing', // Description
                200, // Velocity of notification
                2000 // (optional) Time of delay to close automatically
              );
            }
          }
      })
      return false;
    }
  });


});
