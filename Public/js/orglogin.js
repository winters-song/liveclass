
(function($){
  'use strict';

  var loginUrl = '/admin/public/login';
  var forgetUrl = '/admin/forget/resetPassword';

  function render(){
    if(!Modernizr.indexeddb){
      $('.form-control').ezpz_hint();
    }

    var $form = $('#loginForm');
    var $error = $('#error-info', $form );
    var $name = $('[name=user]', $form );
    var $password = $('[name=password]', $form );

    function showError(msg){
      $error.html(msg).slideDown();
    }

    $form.on('submit', function(e){
      e.preventDefault();

      var username = $name.val();
      var password = $password.val();

      if(username && password){

        var params = $.param({
          username: username,
          password: password
        });

        $.ajax({
          url: loginUrl,
          type: 'post',
          cache: false,
          data: params,
          dataType: 'json'
        }).done(function(data){

          if(data.success){
            $error.html('').hide();
            window.location.href = '/Public/orgAdmin/';
          }else if(data.error_code == '402'){
            showError('密码错误次数过多，请15分钟后重新登录！');
          }else{
            showError('用户名或密码错误！');
          }

        }).fail(function(){
          showError('用户名或密码错误！');
        });
      }else{
        showError('请填写用户名和密码！');
      }
    });
  }
  
  function initForget(){

    var $dialog = $('#forgetDialog');
    var $form = $('form', $dialog);
    var $error = $('.alert', $form );
    var $username = $('[name=username]', $form );
    var $email = $('[name=email]', $form );
    var $submit = $('.submit-btn', $dialog);

    $submit.on('click', function(){
      $form.submit();
    });

    $form.on('submit', function(e){
      e.preventDefault();

      var username = $username.val();
      var email = $email.val();

      if(username && email){

        var params = $.param({
          username: username,
          email: email
        });

        $.ajax({
          url: forgetUrl,
          type: 'post',
          cache: false,
          data: params,
          dataType: 'json'
        }).done(function(data){

          if(data.success){
            $dialog.modal('hide');
            bootbox.alert('提交成功！请到您的邮箱查收邮件。');
          }else{
            $error.html(data.error_code).slideDown();
          }

        }).fail(function(){
          $error.html('提交失败！').slideDown();
        });
      }else{
        $error.html('请填写用户名和邮箱！').slideDown();
      }
    });
  }

  /**
   * onReady
   */
  $(function(){
    render();
    initForget();
  });
// End of onReady

})(jQuery);