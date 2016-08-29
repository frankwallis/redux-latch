import {getFlag, getSemaphore} from './queries'
import {enterLatch, leaveLatch} from './actions'
import {LatchState} from './reducer'

type CanExecutePredicate<TOptions> = (latches: LatchState, options: TOptions) => boolean;

interface LatchOptions {
   name: string;
   canExecute: CanExecutePredicate<this>;
   stateSelector: (state: any) => LatchState;
}

function createLatch<TOptions extends LatchOptions>(actionCreator: Function, options: LatchOptions): Function {
   return function latchOnceCreator(...args) {
      return function latchOnceWrapper(dispatch, getState) {
         const latches = options.stateSelector(getState());

         if (options.canExecute(latches, options)) {
            dispatch(enterLatch(options.name));

            return Promise.resolve(dispatch(actionCreator.apply(null, args)))
               .then(() => dispatch(leaveLatch(options.name)));
         }
      }
   };
}

export interface RunOnceOptions extends LatchOptions {
   timeout?: number;
   keySelector?: (...args) => string;
}

export function runOnce<T extends Function>(actionCreator: T, options?: RunOnceOptions): T {
   options = options || {} as RunOnceOptions;
   options.name = options.name || (actionCreator as any).displayName + '_' + new Date().getTime();
   options.stateSelector = options.stateSelector || (state => state.latches);
   options.keySelector = options.keySelector || ((...args) => undefined);

   options.timeout = options.timeout || -1;
   options.canExecute = runOnceCanExecute;

   return createLatch(actionCreator, options) as T;
}

function runOnceCanExecute(latches: LatchState, options: RunOnceOptions): boolean {
   return !getFlag(latches, options.name);
}

function runCriticalCanExecute(latches: LatchState, options: RunOnceOptions): boolean {
   return (getSemaphore(latches, options.name) === 0);
}