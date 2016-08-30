"use strict";
var queries_1 = require('./queries');
var actions_1 = require('./actions');
function createLatch(actionCreator, options) {
    return function latchOnceCreator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function latchOnceWrapper(dispatch, getState) {
            var latches = options.stateSelector(getState());
            var keys = options.keySelector.apply(options, args);
            var entry = queries_1.getLatchEntry(latches, options.name, keys);
            if (options.canExecute(entry, options)) {
                dispatch(actions_1.enterLatch(options.name, keys));
                return Promise.resolve(dispatch(actionCreator.apply(null, args)))
                    .then(function () { return dispatch(actions_1.leaveLatch(options.name, keys)); });
            }
        };
    };
}
function runOnce(actionCreator, options) {
    options = options || {};
    options.name = options.name || actionCreator.displayName + '_' + new Date().getTime();
    options.stateSelector = options.stateSelector || (function (state) { return state.latches; });
    options.keySelector = options.keySelector || (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return [];
    });
    options.timeout = options.timeout || -1;
    options.canExecute = runOnceCanExecute;
    return createLatch(actionCreator, options);
}
exports.runOnce = runOnce;
function runOnceCanExecute(entry, options) {
    return (entry.started <= 0);
}
