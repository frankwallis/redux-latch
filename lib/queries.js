"use strict";
function getEntry(state, name) {
    return state[name];
}
exports.getEntry = getEntry;
function getSemaphore(state, name) {
    var entry = getEntry(state, name);
    return (entry && entry.semaphore) || 0;
}
exports.getSemaphore = getSemaphore;
function getFlag(state, name) {
    var entry = getEntry(state, name);
    return (entry && entry.flag) || false;
}
exports.getFlag = getFlag;
