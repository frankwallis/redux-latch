import {getLatchEntry} from './queries'
import {enterLatch, leaveLatch} from './actions'
import {LatchState, LatchEntry} from './reducer'

type CanExecutePredicate<TOptions> = (entry: LatchEntry, options: TOptions) => boolean;

interface LatchOptions {
   displayName?: string;
   canExecute?: CanExecutePredicate<this>;
   stateSelector?: (state: any) => LatchState;
   keySelector?: (...args) => any[];
}

function createLatch<T extends Function>(actionCreator: T, options: LatchOptions): T {
   const namePrefix = options.displayName || (actionCreator as any).displayName || 'latch';
   options.displayName = namePrefix + '_' + new Date().getTime();
   options.stateSelector = options.stateSelector || (state => state.latches);
   options.keySelector = options.keySelector || ((...args) => []);

   return function latchOnceCreator(...args) {
      return function latchOnceWrapper(dispatch, getState) {
         const latches = options.stateSelector(getState());
         const keys = options.keySelector(...args);
         const entry = getLatchEntry(latches, options.displayName, keys);

         if (options.canExecute(entry, options)) {
            dispatch(enterLatch(options.displayName, keys));

            return Promise.resolve(dispatch(actionCreator(...args)))
               .then(acResult => {
                  dispatch(leaveLatch(options.displayName, keys))
                  return acResult;
               });
         }
      }
   } as any as T;
}

export interface RunOnceOptions extends LatchOptions {
   timeout?: number;
}

export function runOnce<T extends Function>(actionCreator: T, options?: RunOnceOptions): T {
   options = options || {} as RunOnceOptions;
   options.timeout = options.timeout || -1;
   options.canExecute = runOnceCanExecute;

   return createLatch(actionCreator, options);
}

function runOnceCanExecute(entry: LatchEntry, options: RunOnceOptions): boolean {
   return (entry.started <= 0);
}

