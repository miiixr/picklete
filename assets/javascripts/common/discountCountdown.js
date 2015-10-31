(function ($) {

  var interval = 1000;
  var runTimer = function (differ, target) {
    var durationTime = differ.asMilliseconds();
    setInterval(function(){

      var duration = moment.duration(durationTime, 'milliseconds');
      durationTime -= interval;
      //show how many hours, minutes and seconds are left
      target.find('span').text(moment(duration.asMilliseconds()).format('h:mm:ss'));
    }, interval);
  };

  var promos = $('.promo-end');
  if (promos.length < 1)
    return;

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

}(jQuery));