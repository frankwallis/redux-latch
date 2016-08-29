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
            if (options.canExecute(latches, options)) {
                dispatch(actions_1.enterLatch(options.name));
                return Promise.resolve(dispatch(actionCreator.apply(null, args)))
                    .then(function () { return dispatch(actions_1.leaveLatch(options.name)); });
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
        return undefined;
    });
    options.timeout = options.timeout || -1;
    options.canExecute = runOnceCanExecute;
    return createLatch(actionCreator, options);
}
exports.runOnce = runOnce;
function runOnceCanExecute(latches, options) {
    return !queries_1.getFlag(latches, options.name);
}
function runCriticalCanExecute(latches, options) {
    return (queries_1.getSemaphore(latches, options.name) === 0);
}
