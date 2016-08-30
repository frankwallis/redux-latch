"use strict";
var initialState = {};
exports.emptyLatch = {
    started: 0,
    completed: 0,
    lastStarted: undefined,
    lastCompleted: undefined
};
function updateLatch(state, name, keys, updater) {
    return setLatch(state, [name].concat(keys), updater);
}
function setLatch(state, keys, updater) {
    if (keys.length === 0) {
        state = state || exports.emptyLatch;
        return updater(state);
    }
    else {
        var key = keys[0];
        var result = Object.assign({}, state);
        result[key] = setLatch(result[key], keys.slice(1), updater);
        return result;
    }
}
function latchReducer(state, action) {
    state = state || initialState;
    switch (action.type) {
        case "LATCH_ENTER": {
            return updateLatch(state, action.payload.name, action.payload.keys, (function (entry) {
                return {
                    started: entry.started + 1,
                    completed: entry.completed,
                    lastStarted: new Date(),
                    lastCompleted: entry.lastCompleted
                };
            }));
        }
        case "LATCH_LEAVE": {
            return updateLatch(state, action.payload.name, action.payload.keys, (function (entry) {
                if (entry.completed >= entry.started)
                    throw new Error("Latch was completed without being started");
                return {
                    started: entry.started,
                    completed: entry.completed + 1,
                    lastStarted: entry.lastStarted,
                    lastCompleted: new Date()
                };
            }));
        }
        default: {
            return state;
        }
    }
}
exports.latchReducer = latchReducer;
