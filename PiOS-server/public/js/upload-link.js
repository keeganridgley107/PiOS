'use strict';

(function() {

    const $uploadlink = $('.upload-link-btn');

    $uploadlink.click((event) => {
    event.preventDefault();

    const options = {
      dataType: 'json',
      type: 'post',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        window.location.href = '/landing';
      })
      .fail(() => {
        toastr.error('You must sign in to access files');
      });
});
})();
