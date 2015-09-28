(function($) {
  console.log('test2');
  var group = $('ul.list-brand').sortable({
    group: 'serialization',
    onDrop: function($item, container, _super) {
      var data = group.sortable('serialize').get();
      console.log(data);
      $.ajax({
        data: {data: data},
        type: 'PUT',
        url: '/admin/brands/resetWeight',
      });
      _super($item, container);
    },
  });
}(jQuery));
