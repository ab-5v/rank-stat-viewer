;(function(global, undefined) {

    var rsv = global.rsv = {};

    require('./yate.js');

    $('body').html( rsv.yate({}, 'body') );

})(this);
