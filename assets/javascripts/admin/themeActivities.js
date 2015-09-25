 "use strict";
$(function  () {
  var $imageSectionContainer = $('ul.imageSection'),
      $imageSectionSample = $('#imageSectionSample'),
      $imageSectionSample_inputs = $imageSectionSample.find('input'),
      $topicActiveForm = $('form#ActivitiesData'),
      $topicTitle = $('#topicTitle');

  // modal
  var $uploadFileName = $('#uploadFileName'),
      $openWindow = $('#openWindow'),
      $productUrl1 = $('#productUrl1'),
      $productUrl2 = $('#productUrl2'),
      $fileInputPath = $('#fileInputPath'),
      $inputUploadFile = $('#inputUploadFile'),
      $fileInputWidth = $('#fileInputWidth'),
      $fileInputHeight = $('#fileInputHeight'),
      $fileInputResetButton = $('#fileInputResetButton'),
      $modalConfirmButton = $('#modalConfirmButton');

  // clear hidden input value when fileinput reset button click
  $fileInputResetButton.click(function() {
    $fileInputPath.val('');
  });

  // imageSection sortable, reset weight when imageSection drop
  $("ul").sortable({});

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    $('#modal-delete').on('click','.btn-green',function(e){
      if(that.context.nextElementSibling == null){
        that.parent().parent().parent().remove();
      }
    });
  });

  /* add new imageSection */
  $('body').on('click','.btn-add',function(e) {
    // get imageSection count (include imageSectionSample)
    var index = $('li.imageSection').length;
    // replace imageSectionSample's name index
    $imageSectionSample_inputs.map(function() {
      var $input = $(this);
      var newName = $input.attr('name').replace('0', index);
      $input.attr('name', newName);
    });
    // append new imageSection
    $imageSectionContainer.append( $imageSectionSample.html() );
  });

  var imageContainerId, $imageContainer;

  /* image container + icon click event */
  $(document).on("click", ".fileinput-square a", function (e) {
    //e.preventDefault();
    //$(this).blur();

    $imageContainer = $(this);
    imageContainerId = $imageContainer.data('id');
    var imagePath = $imageContainer.find('input[data-content="path"]').val();

    /* initialize modal Section */
    var isOpenWindow = $imageContainer.find('input[data-content="openWindow"]').val();
    if(isOpenWindow == 'true')
      isOpenWindow = true;
    else
      isOpenWindow = false;
    $openWindow.prop('checked', isOpenWindow);
    $fileInputPath.val(imagePath);
    // reset fileinput
    $fileInputResetButton.click();
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

    //return false;
  });

  /* modal confirm button - click event */
  $('.modal-content').on('click', '#modalConfirmButton', function(e) {
    e.preventDefault();
    var that = $(this),
        url = '',
        path = '',
        $openWindow = $('#openWindow'),
        $modalRatio = $('input[name=optionsRadios]:checked'),
        modalRatioValue = $modalRatio.val(),
        productUrl1Value = $productUrl1.val(),
        productUrl2Value = $productUrl2.val(),
        fileInputPath = $fileInputPath.val();

    if (modalRatioValue == 'option1') {
      // 目前Task先不管選項一 這邊預設空值無法完成
      // to do
      path = '';
      url = '';
      // path = productUrl1Value;
      // url = productUrl1Value;

      if (productUrl1Value.indexOf('/shop/products/') >= 0) {
        $.ajax({
          dataType: 'json',
          url: '/admin/topicActivities/ajax',
          data: {
            action: 'getProductPhotoImageUrl',
            productUrl: productUrl1Value
          },
          success: function(data) {
            console.log(data);

            /* add image openWindow, path & url back to form hidden input */
            $imageContainer.find('input[data-content="path"]').val(data.imagePath);
            $imageContainer.find('input[data-content="url"]').val(productUrl1Value);

            if($openWindow.is(':checked')) {
              $imageContainer.find('input[data-content="openWindow"]').val('true');
            }
            else {
              $imageContainer.find('input[data-content="openWindow"]').val('false');
            }

            /* add image url to ime tag */
            $imageContainer.find('img').attr('src', data.imagePath);
            $imageContainer.parent().removeClass('dashed-block-2').addClass('image-exist');

            // close modal
            $modalConfirmButton.attr('data-dismiss', 'modal');
          }
        });
      }
      else {
        alert('網址格式不正確！（請使用商品頁面網址）');

        // this will keep modal exist
        $modalConfirmButton.attr('data-dismiss', '');
      }


    }
    else if (modalRatioValue == 'option2') {
      path = fileInputPath;
      url = productUrl2Value;

      // check inputs isfilled
      if ( !url.length || !path.length ) {
        alert('請上傳圖片，並填寫圖片連結');
        // keep modal exist
        $modalConfirmButton.attr('data-dismiss','');
      }
      else {
        /* add image openWindow, path & url back to form hidden input */
        $imageContainer.find('input[data-content="path"]').val(path);
        $imageContainer.find('input[data-content="url"]').val(url);
        if($openWindow.is(':checked')) {
          $imageContainer.find('input[data-content="openWindow"]').val('true');
        }
        else {
          $imageContainer.find('input[data-content="openWindow"]').val('false');
        }

        /* add image url to ime tag */
        $imageContainer.find('img').attr('src', path);
        $imageContainer.parent().removeClass('dashed-block-2').addClass('image-exist');

        // close modal
        $modalConfirmButton.attr('data-dismiss','modal');
      }
    }

  });

  $topicActiveForm.submit(function() {
    var result = true;
    // sort imageSection weight
    $('li.imageSection').map(function(index) {
      $(this).find('.weight').val(index);
    });
    // check requiredInputs filled
    var $requiredInputs = $topicActiveForm.find('input[type="hidden"]').not('[data-content="openWindow"]').not('.topicTitle');
    $requiredInputs.map(function() {
      if( !$(this).val().length ) {
        result = false;
      }
    });

    if(!result) {
      alert('資料未填寫完整');
    }
    else {
      // write title into imageSection before submit
      $('li.imageSection').map(function() {
        $(this).find('.topicTitle').val( $topicTitle.val() );
      });
    }
    return result;
  });

});
