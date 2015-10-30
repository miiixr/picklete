(function ($) {
  console.log('run');
  var promos = $('.promo-end');
  if (promos.length < 1)
    return;

  var interval = 1000;
  $.each(promos, function (idx, promo) {
    var self = $(promo);
    var end = self.data('end');
    if ( ! end)
      return self.find('span').text('不限時');  
    var eventTime = moment(end).valueOf();
    var currentTime = moment().valueOf(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
    var diffTime = eventTime - currentTime;
    var duration = moment.duration(diffTime*1000, 'milliseconds');
    duration = moment.duration(duration - interval, 'milliseconds');
    self.find('span').text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());

    // var eventTime = moment().valueOf();
    // var currentTime = moment().valueOf();
    // var diffTime = eventTime - currentTime;
    // var duration = moment.duration(diffTime*1000, 'milliseconds');
    
    // duration = moment.duration(duration - interval, 'milliseconds');
    
  });




}(jQuery));