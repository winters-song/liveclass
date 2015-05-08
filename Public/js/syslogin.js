
(function($){
  'use strict';

  var loginUrl = '/admin/public/login';

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
            window.location.href = '/Public/sysAdmin/';
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

  /**
   * onReady
   */
  $(function(){
    render();
  });
// End of onReady

})(jQuery);