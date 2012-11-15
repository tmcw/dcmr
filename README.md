# The DC Municipal Regulations

The [DC Municipal Regulations](http://www.dcregs.dc.gov/).
This is also an experiment in open data design. See relevant post on
[Indexing and Searching Big Static Data](http://macwright.org/2012/11/14/indexing-searching-big-static-data.html)

Most open data sites run as traditional websites; they have a content
management function (a UI for editing content), a 'search engine',
dynamic indexes, and more. They cost quite a bit of money to maintain,
and often don't perform very well.

This is a different approach.

`invert.js` generates an [inverted index](http://en.wikipedia.org/wiki/Inverted_index)
of documents so that searches can run entirely in Javascript. And since
this search index can be quite large, it allows it to be segmented.

`titles.js` generates a titles document, and `index.html` is a lightweight
index.

Future bits will generate redirects to provide alternative url schemes via
generating redirect pages.

The objective is to allow a large dataset, like the DCMR (~20k documents,
~68MB of plain text), to be quickly and easily browsed on a website that's
powered by a simple, cheap host like Amazon S3. A government or individual
could then pre-pay for years of service.

This should also permit incredibly easy clonability; federating the data
store will be as simple as downloading a copy.


## Installation

    mkdir docs text indexes

Install node.js module dependencies:

    npm install

Scrape the datasource

    node/scrape/scrape.js

Generate a json document from the titles generated in the docs directory

    node titles.json

Convert the documents into plain text
Requires python plugins `catdoc` and `sh` installed which you can install via pip

    python textify.py

Lastly, generate an index by running

    cd generate_index
    node invert.js
    node trie.js
