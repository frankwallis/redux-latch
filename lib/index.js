"use strict";
var queries_1 = require('./queries');
var actions_1 = require('./actions');
function createLatch(actionCreator, options) {
    var namePrefix = options.displayName || actionCreator.displayName || 'latch';
    options.displayName = namePrefix + '_' + new Date().getTime();
    options.stateSelector = options.stateSelector || (function (state) { return state.latches; });
    options.keySelector = options.keySelector || (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return [];
    });
    return function latchOnceCreator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function latchOnceWrapper(dispatch, getState) {
            var latches = options.stateSelector(getState());
            var keys = options.keySelector.apply(options, args);
            var entry = queries_1.getLatchEntry(latches, options.displayName, keys);
            if (options.canExecute(entry, options)) {
                dispatch(actions_1.enterLatch(options.displayName, keys));
                return Promise.resolve(dispatch(actionCreator.apply(null, args)))
                    .then(function (acResult) {
                    dispatch(actions_1.leaveLatch(options.displayName, keys));
                    return acResult;
                });
            }
        };
    };
}
function runOnce(actionCreator, options) {
    options = options || {};
    options.timeout = options.timeout || -1;
    options.canExecute = runOnceCanExecute;
    return createLatch(actionCreator, options);
}
exports.runOnce = runOnce;
function runOnceCanExecute(entry, options) {
    return (entry.started <= 0);
}
