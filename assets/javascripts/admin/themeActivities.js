 "use strict";
$(function  () {
  let $imageSectionContainer = $('ul.imageSection');
  let $uploadFileName = $('#uploadFileName'),
      $openWindow = $('#openWindow'),
      $productUrl1 = $('#productUrl1'),
      $productUrl2 = $('#productUrl2'),
      $fileInputPath = $('#fileInputPath'),
      $inputUploadFile = $('#inputUploadFile'),
      $fileInputWidth = $('fileInputWidth'),
      $fileInputHeight = $('fileInputWidth');

  $("ul").sortable();

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      if(that.context.nextElementSibling == null){
        that.parent().parent().parent().remove();
      }
    });
  });

  var $weightCount = 1;

  /* copy the first one imageSection to hidden imageSectionSample */
  let imageSectionHtml = $('li.imageSection')[0].outerHTML;
  let $imageSectionSample = $('#imageSectionSample');
  $imageSectionSample.append(imageSectionHtml);
  /* initialize imageSectionSample */
  // $imageSectionSample.find('input')
  $imageSectionSample.find('image-exist').removeClass('image-exist').addClass('dashed-block-2');
  let $imageSectionSample_inputs = $imageSectionSample.find('input');

  /* add new imageSection */
  $('body').on('click','.btn-add',function(e) {
    // get imageSection count (include imageSectionSample)
    let index = $('li.imageSection').length;
    // replace imageSectionSample's name index
    $imageSectionSample_inputs.map(function() {
      let $input = $(this);
      let newName = $input.attr('name').replace('0', index);
      $input.attr('name', newName);
    });
    // append new imageSection
    $imageSectionContainer.append( $imageSectionSample.html() );
    // $('li.imageSection').last().find('input').attr('value', $weightCount);
    // $weightCount = $weightCount + 1;
  });

  let weight, imageContainerId, $imageContainer;

  /* image container + icon click event */
  $(document).on("click", ".fileinput-square a", function (e) {

    $imageContainer = $(this);
    imageContainerId = $imageContainer.data('id');
    let imagePath = $imageContainer.find('input[data-content="path"]').val();

    /* initialize modal Section */
    let isOpenWindow = $imageContainer.find('input[data-content="openWindow"]').val();
    if(isOpenWindow)
      isOpenWindow = true;
    else
      isOpenWindow = false;
    $openWindow.prop('checked', isOpenWindow);
    $fileInputPath.val(imagePath);
    // $inputUploadFile.val(imagePath);

    /* set image width & height */
    if(imageContainerId == 1 || imageContainerId == 6 || imageContainerId == 7) {
      $fileInputWidth.val('500');
      $fileInputHeight.val('500');
    }
    else {
      $fileInputWidth.val('160');
      $fileInputHeight.val('160');
    }

    /* check input uploadfile exist */
    if(imagePath) {
      $('.fileinput.fileinput-new').removeClass('fileinput-new').addClass('fileinput-exists');
      $('.fileinput-preview').html('<img />');
      $('.fileinput-preview>img').attr('src', imagePath);
    }
    else {
      $('.fileinput.fileinput-exists').removeClass('fileinput-exists').addClass('fileinput-new');
      $('.fileinput-preview').html('');
    }
    // $productUrl1.val('');
    $productUrl2.val($imageContainer.find('input[data-content="url"]').val());

  });

  /* modal confirm button - click event */
  $('.modal-content').on('click', '.btn-green', function(e) {
    e.preventDefault();

    let that = $(this),
        url = '',
        path = '',
        $openWindow = $('#openWindow'),
        $modalRatio = $('input[name=optionsRadios]:checked'),
        modalRatioValue = $modalRatio.val(),
        productUrl1Value = $productUrl1.val(),
        productUrl2Value = $productUrl2.val(),
        fileInputPath = $fileInputPath.val();

    if(modalRatioValue == 'option1'){
      // path = productUrl1Value;
      // url = productUrl1Value;
    }
    else{
      path = fileInputPath;
      url = productUrl2Value;
    }

    /* add image openWindow, path & url back to form hidden input */
    $imageContainer.find('input[data-content="path"]').val(path);
    $imageContainer.find('input[data-content="url"]').val(url);
    if($openWindow.is(':checked'))
      $imageContainer.find('input[data-content="openWindow"]').val('true');

    /* add image url to ime tag */
    $imageContainer.find('img').attr('src',path);

  });
  // /* add imageSectionSample */
  // let $imageSectionSample = $('#imageSectionSample');
  // let imageSectionSample = $('form#ActivitiesData>ul>li').html();
  // console.log(imageSectionSample);
  // $imageSectionSample

});

// $weight = parseInt(that.parent().parent().parent().parent().parent().parent().parent().find('input[name="weight"]').val());
// $target.attr('href', url);
// $target.append($fileinput_url);
// $fileinput_url = '<img src="http://fakeimg.pl/600x600/dddddd/FFF/?text=600x600" class="img-full">';
// $target = $("input[value='"+weight+"']").parent().parent().parent().find("a[data-id='"+imageContainerId+"']");
