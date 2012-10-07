var _s = require('underscore.string'),
    path = require('path'),
    fs = require('fs');

var words = {};
fs.readdir('../indexes', function(err, files) {
    files.map(function(f) {
        var obj = JSON.parse(fs.readFileSync('../indexes/' + f, 'utf8'));
        var keys = Object.keys(obj);
        var trie = {};
        for (var i = 0; i < keys.length; i++) {
            var pos = trie;
            for (var j = 0; j < keys[i].length; j++) {
                if (pos[keys[i][j]] === undefined) {
                    pos[keys[i][j]] = {};
                }
                pos = pos[keys[i][j]];
            }
        }
        fs.writeFileSync('../indexes/' + f + '.trie.json', JSON.stringify(trie));
    });
});
