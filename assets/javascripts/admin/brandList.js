(function($) {
  console.log('test2');
  var group = $('ul.list-brand').sortable({
    group: 'serialization',
    onDrop: function($item, container, _super) {
      var data = group.sortable('serialize').get();

      $.ajax({
        data: data,
        type: 'PUT',
        url: '/admin/brands/resetWeight',
      });
      _super($item, container);
    },

    // axis: 'y',
    // update: function(event, ui) {
    //   console.log('test');
    //   var data = $(this).sortable('serialize');
    //   console.log(data);
    //
    //   // POST to server using $.post or $.ajax
    //   $.ajax({
    //     data: data,
    //     type: 'POST',
    //     url: '/admin/brands/resetWeight',
    //   });
    // }
  });
}(jQuery));
