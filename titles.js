var _s = require('underscore.string'),
    path = require('path'),
    fs = require('fs');

fs.readdir('docs', function(err, files) {
    var titles = {};
    files.filter(function(f) {
        return f.indexOf('.title') !== -1;
    }).map(function(t) {
        var id = +t.match(/(\d+)/)[0];
        titles[id] = fs.readFileSync('docs/' + t, 'utf8').trim();
    });
    console.log('done');
    fs.writeFileSync('titles.json', JSON.stringify(titles));
    console.log('writing thing');
});
