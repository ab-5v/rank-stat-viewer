;(function(global, undefined) {

    var rsv = global.rsv = {};

    require('../node_modules/pzero/pzero.js');
    require('../node_modules/rank/rAnk.js');
    require('./yate.js');

    require('./stat.js');

    require('./cool/cool.js');
    require('./app.js');

    $('body').on('keypress', '.js-request-input', function(e) {
        if (e.which == 13 && $(this).val()) { rsv.stat( $(this).val() ); }
    });

})(this);
