$(function() {

  $("input[name='price-description']").change(function(){
    $("input[name='discount-description']").val("");
    $("input[name='discount-restriction']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='price-restriction']").change(function(){
    $("input[name='discount-description']").val("");
    $("input[name='discount-restriction']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='discount-description']").change(function(){
    $("input[name='price-description']").val("");
    $("input[name='price-restriction']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $("input[name='discount-restriction']").change(function(){
    $("input[name='price-description']").val("");
    $("input[name='price-restriction']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $("#create").click(function () {

    if($("input[name='startDate']").val()=="" || $("input[name='endDate']").val()==""){
      if(!$("input[name='restrictionDate']")[0].checked){
        alert("請輸入活動時間");
        return false;
      }
    }

    var check1 = true,check2 = true;

    if($("input[name='price-description']").val()=="" || $("input[name='price-restriction']").val()==""){
      check1 = false
    }

    if($("input[name='discount-description']").val()=="" || $("input[name='discount-restriction']").val()==""){
      if(!check1)
        check2 =  false;
    }

    if(check1==false && check2==false){
      alert("請輸入折扣");
      return false;
    }

    if(userArray.length!=0){
      userArray.forEach((value) => {
        $("#shopCodeCreateForm").append(
          '<input type=\'hidden\' form=\'shopCodeCreateForm\' name=\'users[]\' value =\''+ value +'\' >'
        );
      });
    }


    $("#shopCodeCreateForm").submit();
  });

  var userArray = [];

  Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };

  $("#showUserSelect").click(function(){
    $('#custom-headers').multiSelect({
      selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='搜尋會員'> 選擇會員",
      selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='搜尋指定會員'> 指定會員",
      afterInit: function(ms){
        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
        .on('keydown', function(e){
          if (e.which === 40){
            that.$selectableUl.focus();
            return false;
          }
        });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
        .on('keydown', function(e){
          if (e.which == 40){
            that.$selectionUl.focus();
            return false;
          }
        });
      },
      afterSelect: function(value){
        this.qs1.cache();
        this.qs2.cache();
        userArray.push(value[0]);
        console.log(userArray);
      },
      afterDeselect: function(value){
        this.qs1.cache();
        this.qs2.cache();
        userArray.remove(value[0]);
        console.log(userArray);
      }
    });
  })
});
