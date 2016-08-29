"use strict";
var queries_1 = require('./queries');
var actions_1 = require('./actions');
function runOnce(actionCreator, options) {
    options = options || {};
    options.timeout = options.timeout || -1;
    options.name = options.name || actionCreator.displayName + '_' + new Date().getTime();
    options.stateSelector = options.stateSelector || (function (state) { return state.latches; });
    options.keySelector = options.keySelector || (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return undefined;
    });
    return function latchOnceCreator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function latchOnceWrapper(dispatch, getState) {
            var latches = options.stateSelector(getState());
            if (!queries_1.getFlag(latches, options.name)) {
                dispatch(actions_1.enterLatch(options.name));
                return Promise.resolve(dispatch(actionCreator.apply(null, args)))
                    .then(function () { return dispatch(actions_1.leaveLatch(options.name)); });
            }
        };
    };
}
exports.runOnce = runOnce;
