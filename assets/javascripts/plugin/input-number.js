(function ($) {

		//plugin bootstrap minus and plus
	//http://jsfiddle.net/laelitenetwork/puJ6G/
	$('.btn-number').on("click", function(e){
		e.preventDefault();

		var that = $(this);
		fieldName = that.attr('data-field');
		type      = that.attr('data-type');
		var input = that.parent().parent().find("input[name='"+fieldName+"']");
		var currentVal = parseInt(input.val());

		if (!isNaN(currentVal)) {
			if(type == 'minus') {

				if(currentVal > input.attr('min')) {
					input.val(currentVal - 1).change();
				}
				if(parseInt(input.val()) == input.attr('min')) {
					$(this).attr('disabled', true);
				}

			} else if(type == 'plus') {

				if(currentVal < input.attr('max')) {
					input.val(currentVal + 1).change();
				}
				if(parseInt(input.val()) == input.attr('max')) {
					$(this).attr('disabled', true);
				}

			}
		} else {
			input.val(0);
		}
	});
	$('.input-number').on("focusin", function(){
		$(this).data('oldValue', $(this).val());
	});
	$('.input-number').on("change", function() {

		minValue =  parseInt($(this).attr('min'));
		maxValue =  parseInt($(this).attr('max'));
		valueCurrent = parseInt($(this).val());

		name = $(this).attr('name');
		if(valueCurrent >= minValue) {
			$(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
		} else {
			alert('Sorry, the minimum value was reached');
			$(this).val($(this).data('oldValue'));
		}
		if(valueCurrent <= maxValue) {
			$(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
		} else {
			alert('Sorry, the maximum value was reached');
			$(this).val($(this).data('oldValue'));
		}


	});
	$(".input-number").on("keydown", function (e) {
			// Allow: backspace, delete, tab, escape, enter and .
			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
				 // Allow: Ctrl+A
				 (e.keyCode == 65 && e.ctrlKey === true) ||
				 // Allow: home, end, left, right
				 (e.keyCode >= 35 && e.keyCode <= 39)) {
					 // let it happen, don't do anything
					return;
				}
			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
	});

}(jQuery));

