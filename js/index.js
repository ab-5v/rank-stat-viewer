;(function(global, undefined) {

    var rsv = global.rsv = {};

    require('./yate.js');

    $('body').html( rsv.yate({}, 'body') );

    $('body')
        .on('keypress', '.js-request-input', function(e) {
            if (e.which == 13 && $(this).val()) {
                $.getJSON($(this).val(), function(data) {
                    console.log(data);
                });
            }
        })

})(this);
