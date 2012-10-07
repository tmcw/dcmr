function search() {
    // the search system object
    var s = {};

    // sharded indexes
    var indexes = {};

    var titles = {};

    // tries
    var tries = {};

    function shard(a) {
        if (!a) return false;
        return a[0].toLowerCase();
    }

    // Get a shard.
    function getindex(a, callback) {
        if (indexes[shard(a)]) return callback(indexes[shard(a)]);

        $.getJSON('indexes/' + shard(a) + '.json', function(o) {
            indexes[shard(a)] = o;
            callback(indexes[shard(a)]);
        });
    }

    function gettrie(a, callback) {
        if (tries[shard(a)]) return callback(tries[shard(a)]);

        $.getJSON('indexes/' + shard(a) + '.json.trie.json', function(o) {
            tries[shard(a)] = o;
            callback(tries[shard(a)]);
        });
    }


    function jointitles(x) {
        var l = [];
        for (var i = 0; i < x.length; i++) {
            l.push({
                id: x[i],
                title: titles[x[i]] || ''
            });
        }
        return l;
    }

    function intersect(a, b) {
        var c = [];
        for (var i = 0; i < a.length; i++) {
            if (b.indexOf(a[i]) !== -1) {
                c.push(a[i]);
            }
        }
        return c;
    }

    function cleansplit(q) {
        var terms = q.split(/\s+/);
        if (!terms.length) return [];
        terms = terms.map(function(t) {
            var clean = t.replace(/[^A-Za-z]/g, '');
            if (!clean) return false;
            else return clean.toLowerCase();
        }).filter(function(t) {
            return t;
        });
        return terms;
    }

    function isEmpty(obj) {
        for (var key in obj) return false;
        return true;
    }

    function autocomplete(q, callback) {
        var terms = cleansplit(q);
        if (!terms) return callback([]);
        var last = terms.pop();
        var limit = 20;
        gettrie(last, function(trie) {
            var pos = trie;
            // inch up pos to end
            var prefix = '';
            for (var i = 0; i < last.length; i++) {
                if (pos[last[i]]) {
                    prefix += last[i];
                    pos = pos[last[i]];
                }
            }
            var strs = [];
            function traverse(pos, prefix) {
                if (strs.length > limit) return callback(strs);
                if (isEmpty(pos)) {
                    strs.push(prefix);
                }
                for (var i in pos) {
                    traverse(pos[i], prefix + i);
                }
            }
            traverse(pos, prefix);
            return callback(strs);
        });
    }

    function query(q, callback) {
        var terms = cleansplit(q);
        if (!terms) return callback([]);
        function doterm(idx) {
            var term = terms.pop();
            getindex(term, function(index) {
                if (!index[term]) return callback([]);
                if (idx) {
                    idx = intersect(idx, index[term]);
                } else {
                    idx = index[term];
                }
                if (!idx) return callback([]);
                if (terms.length) {
                    doterm(idx);
                } else {
                    return callback(jointitles(idx));
                }

            });
        }
        doterm();
    }

    s.query = query;
    s.autocomplete = autocomplete;

    $.getJSON('titles.json', function(t) {
        titles = t;
    });

    return s;
}
