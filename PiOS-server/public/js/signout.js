'use strict';

(function() {

    const $signout = $('#signout-btn');

    $signout.click((event) => {
    event.preventDefault();

    const options = {
      dataType: 'json',
      type: 'DELETE',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        window.location.href = '/index.html';
      })
      .fail(() => {
        toastr.error('Unable to log out. Please try again.', 3000);
      });
});
})();
