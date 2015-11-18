$form_password = $('form[name="modifyPassword"]');
$input_newPwd = $form_password.find('input[name="newPassword"]');
$input_newPwd2 = $form_password.find('input[name="newPassword2"]');

$form_password.submit(function() {
  if($input_newPwd.val() != $input_newPwd2.val()) {
    alert("請再次確認新密碼");
    return false;
  }
});
