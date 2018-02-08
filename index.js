#! /usr/bin/env node
/* jshint esversion:6 */
'use strict';

var express = require('express');
var app     = express();

var Style = require('./style.js');
var sfile = new Style("./data/gutenberg.pos");

function getDefault(req, res) {
  return res.status(400).send('Unimplemented');
}

function getStyle(req, res) {
  let etextNo = Number.parseInt(req.query.etext_no);
  if (Number.isNaN(etextNo)) {
    return res.status(404).send('no etext query');
  }
  let start = Number.parseInt(req.query.start);
  let limit = Number.parseInt(req.query.limit);
  let results = sfile.results(etextNo, start, limit);
  if (results === undefined) {
    return res.status(404).send('not found');
  } else {
    return res.status(200).send(JSON.stringify(results));
  }
}

app.get('/ashurbanipal.web/data/file/style', getStyle);
app.get('/ashurbanipal.web/data/file/topic', getDefault);
app.get('/ashurbanipal.web/data/file/combination', getDefault);
app.get('/ashurbanipal.web/data/file/lookup', getDefault);
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});
app.use(function(err, req, res, next) {
  res.status(500);
  res.render('error', {
    error: err
  });
});

app.listen(3000, () => console.log('Listening on port 3000'));
