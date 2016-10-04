(function() {
    'use strict';

    // Prepare all tooltips.
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'manual' })
        .click(function() {
            $(this).tooltip('show');
        });
    // Hide tooltip when body clicked.
    $('body').on('click', function(evt) {
        if (!evt.target || evt.target.getAttribute('data-toggle') !== 'tooltip')
            $('[data-toggle="tooltip"]').tooltip('hide');
    });
})();
