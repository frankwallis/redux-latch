"use strict";
var actions_1 = require('./actions');
var initialState = {};
function updateLatch(state, name, keys, updater) {
    return setLatch(state, [name].concat(keys), updater);
}
function setLatch(state, keys, updater) {
    console.log(state);
    console.log(keys);
    if (keys.length === 0) {
        state = state || {
            started: 0,
            completed: 0,
            lastStarted: undefined,
            lastCompleted: undefined
        };
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
    if (actions_1.IS_LATCH_ENTER(action)) {
        return updateLatch(state, action.payload.name, action.payload.keys, (function (entry) {
            return {
                started: entry.started + 1,
                completed: entry.completed,
                lastStarted: new Date(),
                lastCompleted: entry.lastCompleted
            };
        }));
    }
    else if (actions_1.IS_LATCH_LEAVE(action)) {
        return updateLatch(state, action.payload.name, action.payload.keys, (function (entry) {
            return {
                started: entry.started,
                completed: entry.completed + 1,
                lastStarted: entry.lastStarted,
                lastCompleted: new Date()
            };
        }));
    }
    else {
        return state;
    }
}
exports.latchReducer = latchReducer;
