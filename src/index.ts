import {getFlag, getSemaphore} from './queries'
import {enterLatch, leaveLatch} from './actions'
import {LatchState} from './reducer'

export interface RunOnceOptions {
   name?: string;
   timeout?: number;
   stateSelector?: (state) => LatchState;
   keySelector?: (...args) => string;   
}

export function runOnce<T extends Function>(actionCreator: T, options?: RunOnceOptions): T {
   options = options || {};
   options.timeout = options.timeout || -1;
   options.name = options.name || (actionCreator as any).displayName + '_' + new Date().getTime();
   options.stateSelector = options.stateSelector || (state => state.latches);      
   options.keySelector = options.keySelector || ((...args) => undefined);
   
   return function latchOnceCreator(...args) {
      return function latchOnceWrapper(dispatch, getState) {
         const latches = options.stateSelector(getState());
         
         if (!getFlag(latches, options.name)) {
            dispatch(enterLatch(options.name));
            
            return Promise.resolve(dispatch(actionCreator.apply(null, args)))
               .then(() => dispatch(leaveLatch(options.name)));                        
         }         
      }
   } as any as T;
}