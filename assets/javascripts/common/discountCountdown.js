(function ($) {
  var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
  $(".notice-to-buy").on("click", function(e){
    var productid = $(".notice-to-buy").data("productid");
    $.ajax({
      url : '/user/loginStatus',
      type: "get",
      data : null,
      success:function(data, textStatus, jqXHR)
      {
        console.log('=== data ==>',data.loginStatus);
        if(data.loginStatus){
          $.ajax({
            url : '/user/AdviceCustomerListController',
            type: "get",
            data : {
              productid : productid
            },
            success:function(data, textStatus, jqXHR)
            {
              alert(data);
            }
          });
        }else{
          if (isMobile) {
            alert('請先登入帳號密碼')
            return location.href='/user/login';
          }
            
          $('#modal-login').modal('show')
        }
      }
    });  
  });


  var initFlashCountdown = function () {
    var promos = $('.promo-end');
    if (promos.length < 1)
      return;
    
    var interval = 1000;
    var runTimer = function (differ, target) {
      var durationTime = differ.asMilliseconds();
      setInterval(function(){

        var duration = moment.duration(durationTime, 'milliseconds');
        durationTime -= interval;
        //show how many hours, minutes and seconds are left
        target.find('span').text(moment(duration.asMilliseconds()).format('hhh:mm:ss'));
      }, interval);
    };

    
    $.each(promos, function (idx, promo) {
      
      var self = $(promo);
      var end = self.data('end');
    
      if ( ! end || end === 'undefined') {
        return self.find('span').text('不限時'); 
      }
        

      var eventTime = moment(end).valueOf();
      var currentTime = moment().valueOf(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
      var diffTime = eventTime - currentTime;

      var duration = moment.duration(diffTime, 'milliseconds');

      runTimer(duration, self);    
    });
  };

  initFlashCountdown();




}(jQuery));