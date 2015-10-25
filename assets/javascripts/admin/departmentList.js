(function ($) {
  var dptId = [];
  var subDptId =[];

  //get all dpt id
  $.each($(".list-group-item.edit-link.dptSort"),function(){
    if($(this).data('weight') != 999){
      dptId.push($(this).data('id'));
    }
      });

  var _closeAddBtn, _showAddBtn, _addBtn;

  _addBtn = $('.btn.btn-sm-circle.btn-green.m-left-1');

  _showAddBtn = function () {
    _addBtn.css("display","inline-block");
  };

  _closeAddBtn = function () {
    _addBtn.css("display","none");
  };


  $('.glyphicon.glyphicon-pencil2.m-left-1').click(function(event){
    var e = $(event.currentTarget);
    document.getElementById('lg-id').value = e.data('id');
    document.getElementById('lg').value = e.data('name');
    $('#modal-control-shop-type-lg').modal('show');
  });

  $('.dpt.name').click(function(event){
    var e = $(event.currentTarget);

    var id = e.data('id');
    $.each(dptId,function(index){
      document.getElementById('subDpt' + dptId[index]).style.display = "none";
    });

    document.getElementById('special').style.display = "none";
    document.getElementById('subDpt'+id).style.display = "block";
  
    subDptId.length = 0;

    $.each($('#subDpt'+id).children(".list-group-item.edit-link"),function(){
      subDptId.push($(this).data('id'));
    });
  
    document.getElementById('sm-id').value = e.data('id');


    _showAddBtn();
  });

  $('.special.project').click(function(event){
    var e = $(event.currentTarget);
    var id = e.data('id') - 1;
    $.each(dptId,function(index){
      document.getElementById('subDpt' + dptId[index]).style.display = "none";
    });
  
    subDptId.length = 0;
    $.each($('#special').children(".list-group-item.edit-link"),function(){
      subDptId.push($(this).data('id'));
    });
    
    document.getElementById('special').style.display = "";
    document.getElementById('sm-id').value = e.data('id');
    // _closeAddBtn();
  });


  $('.subDpt.name').click(function(event){
    var e = $(event.currentTarget);
    document.getElementById('set-sm-id').value = e.data('id');
    document.getElementById('set-sm').value = e.data('name');
    $('#modal-control-shop-type-sm-update').modal('show');
  });

  $('.delete.subDpt').click(function(event){
    var e = $(event.currentTarget);
    var targetName = e.prev().data('name');
    var deleteNode = $('#modal-delete');
    document.getElementById('del-sm-id').value = e.data('id');
    deleteNode.find(".subDptName").html(targetName);
    deleteNode.modal('show');
  });

  // show default 0 subDpt
  document.getElementById('subDpt'+ dptId[0]).style.display = "block";


  // dpt-big sortable
  $("#dpt-big div ul.list-group ul.dpt").sortable({
    group: 'no-drop',
    handle: 'span.glyphicon-menu',
    onDrop: function($item, container, _super){

      var data = [];
      var weight = 0;

      dptId.length = 0;

      $.each($(".list-group-item.edit-link.dptSort"),function(){
        if($(this).data('weight') != 999){
          dptId.push($(this).data('id'));
        }
      });
      
      $.each($(".list-group-item.edit-link.dptSort"),function(){
        if($(this).data('weight') != 999){
          data.push(weight);
          weight++;
        }
      });

      $.ajax({
        data: {
          sort: data,
          id: dptId
        },
        type: 'PUT',
        url: '/admin/department/sortable',
      });

      _super($item, container);
    }
  });

  $("#small-dpt div ul").sortable({
    onDrop: function($item, container, _super){
      var dptId = $item.context.value;
      var data = [];
      var subDptId = [];
      var weight = 0;

      $.each($("#subDpt"+dptId+" li"),function(){
        subDptId.push($(this).data('id'));
        data.push(weight);
        weight++;
      });


      $.ajax({
        data: {
          sort: data,
          id: subDptId
        },
        type: 'PUT',
        url: '/admin/department/sub/sortable',
      });
      
      _super($item, container);

    }
  });

}(jQuery));
