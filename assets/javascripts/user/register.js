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
  // $('#twzipcode select').data('inline', 'true');
  // $('#twzipcode > div').css('display', 'inline-block');


});
