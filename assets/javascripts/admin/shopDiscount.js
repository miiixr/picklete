$(function() {

  $("input[name='price']").change(function(){
    $("input[name='discount']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='discount']").change(function(){
    $("input[name='price']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $('#add').click(function(){

    var select =[];
    $(".addSelect").each(function(index,dom){
      if(dom.checked){
        select.push(dom);
        $("#shopDiscount").append(
          '<input type=\'hidden\' form=\'shopDiscount\' name=\'productGmIds[]\' value =\''+ dom.value +'\' >'
        );
      }
    });

    if(select.length==0){
      alert("記得選取折扣項目喔");
      return false;
    }

    if($("input[name='title']").val()==""){
      alert("記得輸入活動名稱喔");
      return false;
    }

    if($("input[name='description']").val()==""){
      alert("記得輸入活動文案喔");
      return false;
    }

    if($("input[name='price']").val()=="" && $("input[name='discount']").val()==""){
      alert("記得輸入折扣喔");
      return false;
    }

    $("#shopDiscount").submit();

  });
});
