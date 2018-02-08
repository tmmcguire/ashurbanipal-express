/* jshint esversion:6 */
const fs = require('fs');

function parse(data) {
  let rowByEtn  = new Map();
  let etnByRow  = new Map();
  let etextData = [];
  let i         = 0;
  for (let line of data.split('\n')) {
    if (line === "") {
      continue;
    }
    let row     = line.split('\t');
    let etextNo = Number.parseInt(row.shift());
    rowByEtn.set(etextNo, i);
    etnByRow.set(i, etextNo);
    etextData.push(new Float64Array(row.map(Number.parseFloat)));
    i += 1;
  }
  return [rowByEtn, etnByRow, etextData];
}

function distance(row1, row2) {
  let sum = 0.0;
  for (let i = 0; i < row1.length; ++i) {
    let diff = row1[i] - row2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function distanceCmp(l, r) {
  return l.distance - r.distance;
}

var Style = function(file) {
  let contents = parse(fs.readFileSync(file, "utf8"));
  this.rowByEtn  = contents[0];
  this.etnByRow  = contents[1];
  this.etextData = contents[2];
};

Style.prototype.results = function(etn, start, limit) {
  start = start || 0;
  limit = limit || 20;
  let row = this.rowByEtn.get(etn);
  if (row === undefined) {
    return undefined;
  }
  let chosen  = this.etextData[row];
  let results = [];
  let i       = 0;
  for (let r of this.etextData) {
    results.push({
      etext_no: this.etnByRow.get(i),
      distance: distance(chosen, r),
    });
    i += 1;
  }
  results.sort(distanceCmp);
  return results.slice(start, start + limit);
};

module.exports = Style;
