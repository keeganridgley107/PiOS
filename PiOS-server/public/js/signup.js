'use strict';

(function() {

  // $('#signin').submit((event) => {
  $('#signup-btn').click((event) => {

    event.preventDefault();

    const email = $('#inputEmail').val().trim();
    const username = $('#inputName').val().trim();
    const password = $('#inputPassword').val().trim();;

    if (!username) {
      console.log('no username');
      // toastr.options = {
      //   "positionClass": "toast-bottom-right"
      // };
      return toastr.error('Username must not be blank');
    }
    if (!email) {
      console.log('no email');
      // toastr.options = {
      //   "positionClass": "toast-bottom-right"
      // };
      return toastr.error('Email must not be blank');
    }
    if (!password) {
      console.log('no password');
      // return Materialize.warning('Password must not be blank', 3000);
      return toastr.error('Password must not be blank');
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, username, password }),
      dataType: 'json',
      type: 'POST',
      url: '/users'
    };

    $.ajax(options)
      .done(() => {
        window.location.href = '/signin.html';
      })
      .fail(($xhr) => {
        toastr.error($xhr.responseText);
        console.log("sign up fail");
      });
  });
})();
