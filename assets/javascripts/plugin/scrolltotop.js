jQuery(document).ready(function ($) {
			$(window).scroll(function () {
				if ($(this).scrollTop() > 200) {
					$('#scrolltotop').fadeIn('slow');
				} else {
					$('#scrolltotop').fadeOut('slow');
				}
			});
			$('#scrolltotop').click(function () {
				$("html, body").animate({
					scrollTop: 0
				}, 500);
				return false;
			});
		});