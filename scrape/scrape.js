#!/usr/bin/env node

var cheerio = require('cheerio'),
    fs = require('fs'),
    url = require('url'),
    get = require('get'),
    _ = require('underscore'),
    request = require('request');

function start() {
    var u = 'http://www.dcregs.dc.gov/Search/DCMRSearchByTitle.aspx';
    request(u, function(err, reponse, body) {
        if (err) throw err;

        var $ = cheerio.load(body);
        var togo = [];
        var links = $('a').each(function(i, a) {
            if (a.attribs.href.match(/\/Gateway\/TitleHome\.aspx\?/g)) {
                togo.push(url.resolve(u, a.attribs.href));
            }
        });

        togo.map(chapterhome);
    });
}

function chapterhome(u) {
    request(u, function(err, reponse, body) {
        if (err) throw err;
        console.log('to chapter step');

        var $ = cheerio.load(body);
        var togo = [];
        var links = $('a').each(function(i, a) {
            if (a.attribs.href.match(/ChapterHome\.aspx\?/)) {
                togo.push(url.resolve(u, a.attribs.href));
            }
        });

        togo.map(rulehome);
    });
}

function rulehome(u) {
    request(u, function(err, reponse, body) {
        if (err) throw err;

        console.log('to rule step');
        var $ = cheerio.load(body);
        var togo = [];
        var links = $('a').each(function(i, a) {
            if (a.attribs.href.match(/RuleHome\.aspx\?/)) {
                togo.push(url.resolve(u, a.attribs.href));
            }
        });

        togo.map(download);
    });
}

function download(u) {
    request(u, function(err, reponse, body) {
        if (err) throw err;

        console.log('to dl step');
        var $ = cheerio.load(body);
        var togo = [];
        var links = $('a').each(function(i, a) {
            // LOL
            if (a.attribs.href && a.attribs.href.match(/Download\.aspx\?/)) {
                var title = $('title').text().replace(/\r\n/, '');
                togo.push([title, url.resolve(u, a.attribs.href)]);
            }
        });

        togo.map(dl);
    });
}

var i = 0;

function dl(u) {
    var id = i++;
    get(u[1]).toDisk('docs/' + i + '.doc', function(err) {
        if (err) console.log(err);
    });
    fs.writeFileSync('docs/' + i + '.title', u[0]);
}

start();
