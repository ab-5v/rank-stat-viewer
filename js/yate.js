require('../node_modules/yate/lib/runtime.js');
require('../_tmp/template.js');

rsv.yate = function(data, mode) {
    return yr.run('main', data, mode);
};
yr.externals = yr.externals || {};

yr.externals.random = Math.random;
