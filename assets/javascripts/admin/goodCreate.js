(function ($) {

  var DPTS = window.DPTS;

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

  $('.well').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    console.log(that);
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

  $(".selectDpt").on("change", "select[name='dptId[]']", function(e){
    var that = $(this);
    var DptSubs = DPTS[this.value-1].DptSubs;
    var $selectDptSubId = that.parent().next().find("select[name='dptSubId[]']");
    // clean sub dpt select content
    $selectDptSubId.html("");

    // append sub dpt content
    $selectDptSubId.append("<option value=''>選擇小館別</option>");
    for (var i in DptSubs) {
      $selectDptSubId.append("<option value="+ DptSubs[i].id +">"+ DptSubs[i].name +"</option>");
    }
  });

  // CKEDITOR
  CKEDITOR.replace( 'editor1' );
  // load data from db if exists
  var explainPreLoad = $("#explainContainer").val();
  console.log('explainPreLoad==>',explainPreLoad);
  if( explainPreLoad!=null && explainPreLoad.length>0 ){
    CKEDITOR.instances.editor1.setData( explainPreLoad );
  }

  CKEDITOR.replace( 'editor2' );
  // load data from db if exists
  var noticePreLoad = $("#noticeContainer").val();
  console.log('noticePreLoad==>',noticePreLoad);
  if( noticePreLoad!=null && noticePreLoad.length>0 ){
    CKEDITOR.instances.editor2.setData( noticePreLoad );
  }
  // end of CKEDITOR

  $(function  () {
    $("ol.drag-container").sortable({
      group: 'no-drop',
      handle: '.col-md-1.text-center'
    });
  });

  // $(".fileinput").on('change.bs.fileinput', function (e) {
  //   console.log(e)
  //   console.log("click from select");
  //   $("form#uploadForm").ajaxSubmit(options).submit();
  // });

  // $('#test-upload').on('blur', function (e) {
  //   console.log("trigger file blur ----");
  //   var val = $("#test-upload").val();
  //   $('#fine-uploader').val(val);
  // });


  // var options = {
  //   beforeSubmit:  function (formData, jqForm, options) {
  //     console.log(formData);
  //     // var queryString = $.param(formData);
  //   },
  //   success: function (responseText, statusText, xhr, $form)  {
  //     console.log(responseText);
  //   }
  // };

  // $('form#uploadForm').submit(function() {
  //   return false;
  // });

}(jQuery));
