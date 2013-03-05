;(function() {

var stat, proto;

stat = rsv.stat = function(url) {
    if (stat.active) {
        stat.active.destroy();
    }
    return new proto._init(url);
};

proto = stat.prototype = {

    _init: function(url) {
        this._url = url;
        this._rank = rAnk();
        stat.active = this;

        this.request( this.draw.bind(this) );
    },

    request: function(callback) {
        var that = this;
        $.getJSON(this._url, function(response) {
            that._rank.load(response.result);
            callback();
        });
    },

    draw: function() {

        this._rank.run(function(result) {
            var stat = result.stat;
            var data = result.data;

            var render = [];

            data.forEach(function(item, i) {
                render[i] = { key:  item.login, mark: stat[i] };
            });

            $('.js-stat-wrapper').html( rsv.yate({stat: render, weight: result.weight}, 'stat') );
        });
    },

    destroy: function() {
    }
};

proto._init.prototype = proto;

})();
