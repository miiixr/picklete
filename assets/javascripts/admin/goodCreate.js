(function ($) {
  
  $("#brandSelect").val(undefined);
  $("#brandSelect").change(function() {
    if($("#brandSelect :selected").text() != '選擇品牌'){
      $("input[type='radio'][name='brandType'][value='origin']").prop("checked", true);
      $("input[type='radio'][name='brandType'][value='custom']").prop("checked", false);
    }
  });
  $("input[type='text'][name='customBrand']" ).focus(function() {
    $("input[type='radio'][name='brandType'][value='custom']").prop("checked", true);
    $("input[type='radio'][name='brandType'][value='origin']").prop("checked", false);

  });

  $('input[type=submit]').click(function () {
    if( $('input[name=brandType]:checked').val() == 'origin' ){
      if($("#brandSelect :selected").text() == '選擇品牌'){
        $("#brandSelect").prop('required', true);
      }
    }
    else{
      $("#brandSelect").removeAttr('required');
    }
  });


  $('form').on('click','.color-filter',function(e){
    e.preventDefault();
    var that = $(this);
    that.parent().parent().parent().find('.color-filter.dropdown').attr('class', that.attr('class')+' dropdown');
  });

  $('form').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    var s = $(that.parent().parent()).prop('outerHTML');
    that.parent().parent().after(s);
    that.remove();
  });

  $('.row').on('click','.btn-remove',function(e){
    e.preventDefault();
    var that = $(this);
    if(that.context.nextElementSibling == null){
      that.parent().parent().remove();
    }
  });  


  $('.tag').click(function(e){
    e.preventDefault();
    var that = $(this);
    var s = that[0].innerText;
    $('input[type="text"][name="tag"]').val($('input[type="text"][name="tag"]').val() + ','+ s);
    $('.tagsinput input').before('<span class="tag label label-default">'+ s +'<span data-role="remove">×</span></span>');
  });

  $("select[name='dptId']").change(function(){
    var DptSubs = $("select[name=dptSubId]").data("dpts")[this.value-1].DptSubs;
    var $selectDptSubId = $("select[name='dptSubId']")
    $selectDptSubId.html("");
    $selectDptSubId.append("<option value=''>選擇小館別</option>");
    for (var i in DptSubs) {
      $selectDptSubId.append("<option value="+ DptSubs[i].id +">"+ DptSubs[i].name +"</option>");
    }
  });

}(jQuery));




