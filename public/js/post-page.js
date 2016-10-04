(function () {
    'use strict';

    // Prepare all tooltips.
    $('[data-toggle="tooltip"]').tooltip({ trigger: 'click' });
    $('body').on('click', function(evt) {
        if (evt.target && evt.target.getAttribute('data-toggle') === 'tooltip')
            return false;
        $('[data-toggle="tooltip"]').tooltip('hide');
    });
})();
