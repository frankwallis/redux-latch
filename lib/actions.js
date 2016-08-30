"use strict";
function enterLatch(name, keys) {
    return { type: "LATCH_ENTER", payload: { name: name, keys: keys } };
}
exports.enterLatch = enterLatch;
function leaveLatch(name, keys) {
    return { type: "LATCH_LEAVE", payload: { name: name, keys: keys } };
}
exports.leaveLatch = leaveLatch;
