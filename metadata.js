#! /usr/bin/env node
/* jshint esversion:6 */
'use strict';

const fs = require('fs');

function parse(data) {
  let etextData = new Map();
  let lines     = data.split('\n');
  // Recover the column names, skipping etext_no
  let headers = lines.shift().split('\t').slice(1);
  for (let line of lines) {
    if (line === "") {
      continue;
    }
    let row     = line.split('\t');
    let etextNo = Number.parseInt(row.shift());
    let item    = new Map([['etext_no', etextNo]]);
    for (let i = 0; i < headers.length; ++i) {
      item.set(headers[i], row[i]);
    }
    etextData.set(etextNo, item);
  }
  return etextData;
}

var Metadata = function(file) {
  this.etextData = parse(fs.readFileSync(file, "utf8"));
};

Metadata.prototype.decorate = function(obj) {
  let m = this.etextData.get(obj.etext_no);
  m.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
};

module.exports = Metadata;
