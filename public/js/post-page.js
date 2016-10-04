(function() {
    'use strict';

    var clickEvent = isMobile.any ? 'touchstart' : 'click';
    // Prepare all tooltips.
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'manual' })
        .on('click', function() {
            $(this).tooltip('toggle');
        });
    // Hide tooltip when body clicked.
    $('body').on(clickEvent, function(evt) {
        if (!evt.target || evt.target.getAttribute('data-toggle') !== 'tooltip')
            $('[data-toggle="tooltip"]').tooltip('hide');
    });
})();
