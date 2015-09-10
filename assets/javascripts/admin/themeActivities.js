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
  $('body').on('click','.btn-add',function(e){
    $('ul.imageSection').append($imageSection);
    $('li.imageSection').last().find('input').attr('value', $weightCount);
    $weightCount = $weightCount + 1;
    
  });
  
  var $weight, $id;
  $(document).on("click", ".fileinput-square a", function (e) {
    var that = $(this);
    $weight = parseInt(that.parent().parent().parent().parent().parent().parent().parent().find('input[name="weight"]').val());
    $id = that.data('id');
    console.log($weight, $id);

  });

  $('.modal-content').on('click', '.btn-green', function(e){
    e.preventDefault();
    var that = $(this);
    var $url = '';
    $ratio = $('input[name=optionsRadios]:checked').val(); 
    $checkbox = $('input[type=checkbox]:checked').val() || false; 
    $productUrl1 = $('#productUrl1').val();
    $productUrl2 = $('#productUrl2').val();
    $fileinput_url = '<img src="http://fakeimg.pl/600x600/dddddd/FFF/?text=600x600" class="img-full">';
    $target = $("input[value='"+$weight+"']").parent().parent().parent().find("a[data-id='"+$id+"']");
    
    if($ratio == 'option1'){
      $url = $productUrl1;
    }
    else{
      $url = $productUrl2;
      $target.append($fileinput_url);
    }

    $target.attr('href', $url);
    
  });


});
