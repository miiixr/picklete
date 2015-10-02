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
      $(this).off('submit');
      $(this).submit();
    }
  });


});
