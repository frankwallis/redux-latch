"use strict";
var LATCH_ENTER_ACTION = "LATCH_ENTER_ACTION";
var LATCH_LEAVE_ACTION = "LATCH_LEAVE_ACTION";
function IS_LATCH_ENTER(action) {
    return action.type === LATCH_ENTER_ACTION;
}
exports.IS_LATCH_ENTER = IS_LATCH_ENTER;
function IS_LATCH_LEAVE(action) {
    return action.type === LATCH_LEAVE_ACTION;
}
exports.IS_LATCH_LEAVE = IS_LATCH_LEAVE;
function enterLatch(name, keys) {
    return { type: LATCH_ENTER_ACTION, payload: { name: name, keys: keys } };
}
exports.enterLatch = enterLatch;
function leaveLatch(name, keys) {
    return { type: LATCH_LEAVE_ACTION, payload: { name: name, keys: keys } };
}
exports.leaveLatch = leaveLatch;
