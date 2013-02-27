;(function(global, undefined) {

    var rank-stat-viewer = global.rank-stat-viewer = {};

    require('./yate.js');

    var content = yr.run('main', {username: 'artjock'}, 'test');

    $('body').html( content );

})(this);
