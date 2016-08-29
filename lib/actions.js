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
function enterLatch(name) {
    return { type: LATCH_ENTER_ACTION, payload: { name: name } };
}
exports.enterLatch = enterLatch;
function leaveLatch(name) {
    return { type: LATCH_LEAVE_ACTION, payload: { name: name } };
}
exports.leaveLatch = leaveLatch;
