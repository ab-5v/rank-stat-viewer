cool.view.prototype.html = function(json) {
    return yr.run('main', json.data, 'cool-' + this.name);
};

cool.view({
    name: 'app',
    views: ['request', 'stat'],
    events: {
        'rendered': 'onrendered'
    },
    onrendered: function() {
        $('body').append(this.el);
    }
});

cool.view({
    name: 'request',
    events: {
        'submit': 'onsubmit',
        'rendered': 'onrendered',
        '.control_add -> click': 'confAdd',
        '.control_list -> click': 'confList',
        '.control_rm -> click': 'confRm'
    },
    fields: ['url', 'result', 'key'],
    onrendered: function() {
        var that = this;
        this.fill( this.confLoad()[0] );
    },
    confLoad: function() {
        var conf = [{}];
        try {
            conf = JSON.parse( localStorage.getItem('cool-request') );
        } catch (e) {}

        return conf;
    },
    confSave: function(conf) {
        var saved = false;
        var confs = this.confLoad().map(function(item) {
            if (!item.url || item.url == conf.url) {
                saved = true;
                return conf;
            } else {
                return item;
            }
        });

        if (!saved) {
            confs.push(conf);
        }

        localStorage.setItem('cool-request', JSON.stringify(confs));
    },
    fill: function(conf) {
        var that = this;
        this.fields.forEach(function(name) {
            that['$' + name] = that.el
                .find( 'input[name=' + that.name + '_' + name + ']' )
                .val( conf[name] );
        });
    },
    confAdd: function() {
        this.fill({});
    },
    confList: function() {
        var that = this;
        var confs = this.confLoad();
        var html = function(conf, i) { return '<div data-i="' + i + '">' + conf.url + '</div>'; }

        $('<div/>')
            .html(confs.map(html))
            .css({
                'position': 'absolute',
                'top': '0',
                'background-color': '#fff',
                'z-index': '11'
            })
            .appendTo('body')
            .click(function(e) {
                var i = $(e.target).attr('data-i');
                that.fill(confs[i]);
                $(e.target).parent().remove();
            });
    },
    confRm: function() {
        var url = this.$url.val();
        var confs = this.confLoad().filter(function(conf) {
            return conf.url !== url;
        });

        localStorage.setItem('cool-request', JSON.stringify(confs));
        this.fill({});
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
            this.confSave(params);
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
            that.emit('loaded', stat);
        });
    }
});

cool.view({
    name: 'stat',
    events: {
        'request -> loaded': 'onload',
        'input -> change': 'onchange',
        'input -> keydown': 'onkeypress'
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
        var result = this.rank.run();
        var stat = result.stat;
        var data = result.data;

        var render = data.map(function(item, i) {
            return { key: item, mark: stat[i] };
        });

        this.data({stat: render, weight: result.weight, name: result.factor});

        this.render();
    }
});


cool.view('app');
