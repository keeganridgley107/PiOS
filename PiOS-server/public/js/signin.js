'use strict';
(function() {

  $('#signin-btn').click((event) => {

    event.preventDefault();

    const email = $('#inputEmail').val().trim();
    const password = $('#inputPassword').val().trim();

    if (!email) {
      return toastr.error('Email must not be blank');
      console.log('no email')
    }

    if (!password) {
      console.log('no password');
      $('#welcome-modal').modal('show');
      // Create the audio player, autoplay the sound downloaded
      $("#demo_voices_player").html("<audio src='../sounds/magic_word_c.mp3' controls='controls' autoplay='autoplay' style='display: none'/>");
      return toastr.error('Password must not be blank');
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/token',
      email: email
    };
    $.ajax(options)
      .done(() => {
        // window.location.href = '/user-landing.html';
        window.location.href = '/landing';
      })
      .fail(($xhr) => {
        toastr.error($xhr.responseText);
        console.log("sign in fail");
      });
  });
})();
