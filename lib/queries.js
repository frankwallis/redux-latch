"use strict";
var reducer_1 = require('./reducer');
function getLatchEntry(state, name, keys) {
    var result = keys.reduce(function (node, key) { return node && node[key]; }, state[name]);
    return result || reducer_1.emptyLatch;
}
exports.getLatchEntry = getLatchEntry;
