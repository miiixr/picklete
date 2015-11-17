var deleteMember = function(memberId) {
  $.ajax({
    url: "/api/user/"+memberId,//"/api/user/".memberId,
    type: 'DELETE',
    data: null,
    success: function(result) {
      alert('刪除成功');
      window.location = "/admin/members";
    },
    error: function() {
      alert('請再試一次');
    }
  });
}
