cool.view({
    name: 'app',
    views: ['request', 'stat']
});

cool.view({
    name: 'request',
    events: {
        'submit': 'onsubmit'
    },
    fields: ['url', 'result', 'key'],
    init: function() {
        var that = this;
        var params = {};

        try { params = JSON.parse( localStorage.getItem('cool-request') ) || {}; } catch (e) {}

        this.fields.forEach(function(name) {
            that['$' + name] = that.el
                .find( 'input[name=' + that.name + '_' + name + ']' )
                .val( params[name] );
        });
    },
    onsubmit: function(e) {
        e.preventDefault();

        var that = this;
        var params = {};

        var empties = this.fields.filter(function(name) {
            params[name] = that['$' + name].val();
            return params[name] ? false : that['$' + name].focus();
        });

        if (!empties.length) {
            localStorage.setItem('cool-request', JSON.stringify(params));
            this.getters(params);
            this.load(params);
        }
    },
    getters: function(params) {
        params.key = new Function('return ' + params.key + ';');
        params.result = new Function('return ' + params.result + ';');
    },
    load: function(params) {
        var that = this;
        $.getJSON(params.url, function(resp) {
            var stat = params.result.call(resp);
            stat.data = stat.data.map(function(item) { return params.key.call(item); });
            that.trigger('load', stat);
        });
    }
});

cool.view({
    name: 'stat',
    events: {
        'load.request': 'onload',
        'input change': 'onchange',
        'keydown input': 'onkeypress'
    },
    onload: function(e, stat) {
        this.rank = rAnk();
        this.rank.load(stat);
        this.el.html('');
        this.draw();
    },
    onchange: function(e) {
        var index = this.el.find('input').get().indexOf(e.currentTarget);
        var weight = $.map(this.el.find('input'), function(input) {
            return $(input).val();
        });

        this.rank.weights(weight);

        this.draw();
        this.el.find('input').eq(index).focus();
    },
    onkeypress: function(e) {
        var input = $(e.currentTarget);
        var round = function(val) { return Math.round(val * 10) / 10; }
        var val, which = e.which;

        if (which == 38 || which == 40) {
            if (which == 38) {
                val = round(+input.val() + 0.1);
            } else if (e.which == 40) {
                val = round(+input.val() - 0.1);
            }
            if (val < 0) { val = 0; }
            input.val( val );
        }

        if (e.which == 38 || e.which == 40 || e.which == 13) {
            this.onchange(e);
        }
    },
    draw: function() {
        var that = this;

        this.rank.run(function(result) {
            var stat = result.stat;
            var data = result.data;

            var render = data.map(function(item, i) {
                return { key: item, mark: stat[i] };
            });

            that.data = {stat: render, weight: result.weight};

            that.el.html(that.render().html());
        });
    }
});


cool.view('app').appendTo('body');
