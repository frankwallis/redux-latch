"use strict";
var actions_1 = require('./actions');
var initialState = {};
function latchReducer(state, action) {
    state = state || initialState;
    if (actions_1.IS_LATCH_ENTER(action)) {
        var entry = state[action.payload.name];
        if (entry) {
            // TODO - assertion here.
            entry = { semaphore: entry.semaphore + 1, flag: true };
        }
        else {
            entry = { semaphore: 1, flag: true };
        }
        var result = Object.assign({}, state);
        result[action.payload.name] = entry;
        return result;
    }
    else if (actions_1.IS_LATCH_LEAVE(action)) {
        var entry = state[action.payload.name];
        if (!entry)
            throw new Error("Latch [" + action.payload.name + "] was not found");
        if (entry.semaphore <= 0)
            throw new Error("Latch [" + action.payload.name + "] was released without being acquired");
        entry = { semaphore: entry.semaphore - 1, flag: true };
        var result = Object.assign({}, state);
        result[action.payload.name] = entry;
        return result;
    }
    else {
        return state;
    }
}
exports.latchReducer = latchReducer;
