"use strict";
function getLatchEntry(state, name, keys) {
    return [name].concat(keys || []).reduce(function (result, key) { return result && result[key]; }, state);
}
exports.getLatchEntry = getLatchEntry;
