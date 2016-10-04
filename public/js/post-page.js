(function() {
    'use strict';

    // Prepare all tooltips.
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'manual' })
        .on('touchstart click', function() {
            $(this).tooltip('toggle');
        });
    // Hide tooltip when body clicked.
    $('body').on('touchstart click', function(evt) {
        if (!evt.target || evt.target.getAttribute('data-toggle') !== 'tooltip')
            $('[data-toggle="tooltip"]').tooltip('hide');
    });
})();
