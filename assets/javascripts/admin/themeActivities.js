$(function  () {

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
  var $imageSection = $('li.imageSection')[0].outerHTML;

  // image container + icon click event
  $('body').on('click','.btn-add',function(e){
    $('ul.imageSection').append($imageSection);
    $('li.imageSection').last().find('input').attr('value', $weightCount);
    $weightCount = $weightCount + 1;

  });
  var $uploadFileName = $('#uploadFileName'),
      $openWindow = $('input#openWindow'),
      $productUrl1 = $('#productUrl1'),
      $productUrl2 = $('#productUrl2'),
      $fileInputPath = $('#fileInputPath');

  var weight, imageContainerId, $imageContainer;
  $(document).on("click", ".fileinput-square a", function (e) {
    $imageContainer = $(this);
    // $weight = parseInt(that.parent().parent().parent().parent().parent().parent().parent().find('input[name="weight"]').val());
    imageContainerId = $imageContainer.data('id');
  });


  // modal confirm button - click event
  $('.modal-content').on('click', '.btn-green', function(e) {
    e.preventDefault();

    var that = $(this),
        url = '',
        path = '',
        $openWindow = $('#openWindow');
        $modalRatio = $('input[name=optionsRadios]:checked'),
        modalRatioValue = $modalRatio.val(),
        productUrl1Value = $productUrl1.val(),
        productUrl2Value = $productUrl2.val(),
        fileInputPath = $fileInputPath.val();

    // $fileinput_url = '<img src="http://fakeimg.pl/600x600/dddddd/FFF/?text=600x600" class="img-full">';
    // $target = $("input[value='"+weight+"']").parent().parent().parent().find("a[data-id='"+imageContainerId+"']");

    if(modalRatioValue == 'option1'){
      // path = productUrl1Value;
      // url = productUrl1Value;
    }
    else{
      path = fileInputPath;
      url = productUrl2Value;
      // $target.append($fileinput_url);
    }

    // add image openWindow, path & url back to form hidden input
    $imageContainer.find('input[data-content="path"]').val(path);
    $imageContainer.find('input[data-content="url"]').val(url);
    if($openWindow.is(':checked'))
      $imageContainer.find('input[data-content="openWindow"]').val('true');

    // add image
    $imageContainer.find('img').attr('src',path);

    // $target.attr('href', url);

  });

});
