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

    $("#brandSelect option").removeAttr('selected');
  });

  $('input[type=radio][name=brandType][value=custom]').click(function() {
    $('#brandSelect option').removeAttr('selected');
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


  $('.form-horizontal').on('click','.color-filter',function(e){
    e.preventDefault();
    var that = $(this);
    var val = that.data("value");
    that.parent().parent().parent().find('.color-filter.dropdown').attr('class', that.attr('class')+' dropdown');
    that.parent().parent().parent().find('input[type=hidden]').val(val);
  });

  // btn-add
  $('.well').on('click','.btn-add',function(e){
    e.preventDefault();
    var that = $(this);
    // console.log(that);
    var s = $(that.parent().parent()).prop('outerHTML');
    // replace index
    var index;
    if (index = s.match(/good\[\d/)) {
      index = index[0].match(/\d/)[0];
      index = parseInt(index, 10) + 1;
      s = s.replace(/good\[\d/g, "good[" + index);
    }
    that.parent().parent().after(s);
    that.remove();
  });
  // end btn-add

  // btn-remove
  $('.row').on('click','.btn-remove',function(e){
    e.preventDefault();
    var that = $(this);
    // console.log('=== that.context.previousElementSibling is ==>',that.context.previousElementSibling);
    // console.log('=== that.context.nextElementSibling is ==>',that.context.nextElementSibling);
    if(that.context.nextElementSibling == null){
      that.parent().parent().remove();
    }
  });
  // end btn-remove

  // btn-isPublish
  $('.well').on('click','.btn-status',function(e){
    var that = $(this);
    that.find("input[type=radio]").prop("checked", true);
  });
  // end btn-isPublish



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
  // tab-1
  CKEDITOR.replace( 'editor1' );
  // load data from db if exists
  var explainPreLoad = $("#explainContainer").val();
  console.log('explainPreLoad==>',explainPreLoad);
  if( explainPreLoad!=null && explainPreLoad.length>0 ){
    CKEDITOR.instances.editor1.setData( explainPreLoad );
  }
  // tab-2
  CKEDITOR.replace( 'editor2' );
  // load data from db if exists
  var noticePreLoad = $("#noticeContainer").val();
  console.log('noticePreLoad==>',noticePreLoad);
  if( noticePreLoad!=null && noticePreLoad.length>0 ){
    CKEDITOR.instances.editor2.setData( noticePreLoad );
  }
  // end of CKEDITOR

  // form submit
  $(function  () {
    $("form#goodForm").submit(function() {

      // give weight
      $('li.productWeight').map(function(index) {
        $(this).find('.weight').val(index);
      });
      // end give weight

    });
  });
  // end form submit

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
