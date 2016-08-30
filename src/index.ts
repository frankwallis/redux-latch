import {getLatchEntry} from './queries'
import {enterLatch, leaveLatch} from './actions'
import {LatchState, LatchEntry} from './reducer'

type CanExecutePredicate<TOptions> = (entry: LatchEntry, options: TOptions) => boolean;

interface LatchOptions {
   name: string;
   keys: any[];
   canExecute: CanExecutePredicate<this>;
   stateSelector: (state: any) => LatchState;
   keySelector?: (...args) => any;
}

function createLatch<TOptions extends LatchOptions>(actionCreator: Function, options: LatchOptions): Function {
   return function latchOnceCreator(...args) {
      return function latchOnceWrapper(dispatch, getState) {
         const latches = options.stateSelector(getState());
         const keys = options.keySelector(...args);
         const entry = getLatchEntry(latches, options.name, keys);

         if (options.canExecute(entry, options)) {
            dispatch(enterLatch(options.name, keys));

            return Promise.resolve(dispatch(actionCreator.apply(null, args)))
               .then(() => dispatch(leaveLatch(options.name, keys)));
         }
      }
   };
}

export interface RunOnceOptions extends LatchOptions {
   timeout?: number;
}

export function runOnce<T extends Function>(actionCreator: T, options?: RunOnceOptions): T {
   options = options || {} as RunOnceOptions;
   options.name = options.name || (actionCreator as any).displayName + '_' + new Date().getTime();
   options.stateSelector = options.stateSelector || (state => state.latches);
   options.keySelector = options.keySelector || ((...args) => []);
   options.timeout = options.timeout || -1;
   options.canExecute = runOnceCanExecute;

   return createLatch(actionCreator, options) as T;
}

function runOnceCanExecute(entry: LatchEntry, options: RunOnceOptions): boolean {
   return (entry.started <= 0);
}

