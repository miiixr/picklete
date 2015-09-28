$(function() {
  $('ul.list-brand').sortable({
    axis: 'y',
    update: function(event, ui) {
      console.log('test');
      var data = $(this).sortable('serialize');
      console.log(data);

      // POST to server using $.post or $.ajax
      $.ajax({
        data: data,
        type: 'POST',
        url: '/admin/brands/resetWeight',
      });
    },
  });
});
