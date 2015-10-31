(function($) {
  $('#limit').change(function() {
    location.href='/admin/shop-buy-more-add-item?limit='+$(this).val();
  });

  $('.form-control').change(function(){
    $("input[name='page']").val(0);
  });

  $('#bonusNext').click(function(){
    $("input[name='page']").val(parseInt($("input[name='page']").val())+1);
    $("form[name='search']").submit();
  });

  $('#bonusPrevious').click(function(){
    $("input[name='page']").val(parseInt($("input[name='page']").val())-1);
    $("form[name='search']").submit();
  });

  $("input[name='reducePrice']").change(function(){
    $("input[name='discount']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='discount']").change(function(){
    $("input[name='reducePrice']").val("");
    $("#optionsRadios2")[0].checked=true;
  });


  $("#option1").click(function(){
    $('input:radio[name="activityLimit"]').filter('[value="0"]').attr('checked', true);
    $('input:radio[name="activityLimit"]').filter('[value="1500"]').attr('checked', false);
  });

  $("#option2").click(function(){
    $('input:radio[name="activityLimit"]').filter('[value="1500"]').attr('checked', true);
    $('input:radio[name="activityLimit"]').filter('[value="0"]').attr('checked', false);
  });

  $('#createBuyMore').click(function(){

    if($("input[name='reducePrice']").val()=="" && $("input[name='discount']").val()==""){
      alert("記得輸入折扣喔");
      return;
    }

    if($('input[name="productIds[]"]').length==0){
      alert("記得選取折扣項目喔");
      return;
    }

    if($("input[name='anyTime']")[0].checked == false){
      if($("input[name='startDate']").val()=="" || $("input[name='endDate']").val()==""){
        alert("記得選取活動時間喔");
        return;
      }
    }

    var postData = $("form[name='updateForm']").serializeArray();

    // console.log(postData);
    // alert(1);
    $.ajax({
        url : '/admin/buymoreUpdate',
        type: "put",
        data : postData,
        success:function()
        {
          location.href='../../admin/shop-buy-more';
        }
    });

  });

  $('#buyMoreAddBtn').click(function(e){
    e.preventDefault();
    var formData = $("form[name='updateForm']").serialize();
    window.location.href = '../buymore/buyMoreAddItem?'+formData;
  });

  $('.btn.btn-link.delete-link').click(function(e){
    console.log('deletePorduct click');
    e.preventDefault()

    var deleteProductId = $(this).attr('data-productId');
    $(this).closest("tr").remove();
    $('input[name="productIds[]"][value="'+deleteProductId+'"]')[0].remove();

    console.log('=== deleteProductId ===', deleteProductId);

  });

  // front end hack
  var _visualDiscountNumber = function () {
    var disCountNode = $('input[name=discount]');
    if (disCountNode.val() == undefined || disCountNode.val() === 0)
      return;

    disCountNode.val(disCountNode.val() * 100);
  };
  _visualDiscountNumber();

}(jQuery));
