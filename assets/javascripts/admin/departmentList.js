 $(window).load(function(){
    $('.glyphicon.glyphicon-pencil2.m-left-1').click(function(event){
        var e = $(event.currentTarget);
        document.getElementById('lg-id').value=e.data('id');
        document.getElementById('lg').value=e.data('name');
        $('#modal-control-shop-type-lg').modal('show'); 
    })
    $('.dpt.name').click(function(event){
        var e = $(event.currentTarget);
        var id = e.data('id')-1;
        for(i=0;i<=5;i++){
            document.getElementById('subDpt'+i).style.display="none";
        }
        document.getElementById('subDpt'+id).style.display="";
        document.getElementById('sm-id').value = e.data('id');
        $('.btn.btn-sm-circle.btn-green.m-left-1').css("display","");
    })
      $('.subDpt.name').click(function(event){
        var e = $(event.currentTarget);
        document.getElementById('set-sm-id').value=e.data('id');
        document.getElementById('set-sm').value=e.data('name');
        $('#modal-control-shop-type-sm-update').modal('show'); 
    })
  })