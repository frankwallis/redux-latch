import { getLatchEntry } from './queries'
import { enterLatch, leaveLatch } from './actions'
import { LatchState, LatchEntry } from './reducer'
import { Dispatch, ThunkAction } from 'redux'

interface LatchedFunction<R, S> {
	execute: AsyncActionCreator<Promise<R>, S>;
	invalidate: (...args) => void;
}

interface LatchOptions {
	displayName?: string;
	stateSelector?: (state: any) => LatchState;
	keySelector?: (...args) => any[];
	max?: number;
	maxConcurrent?: number;
}

type SyncActionCreator<A> = (...args) => A;
type AsyncActionCreator<R, S> = (...args) => ThunkAction<R, S, any>;

export function createLatch<R, S>(actionCreator: AsyncActionCreator<R, S>, options?: LatchOptions): LatchedFunction<R, S>
export function createLatch<R>(actionCreator: SyncActionCreator<R>, options?: LatchOptions): LatchedFunction<R, any>
export function createLatch<R, S>(actionCreator: any, options?: LatchOptions): LatchedFunction<R, S> {
	options = options || {};
	options.displayName = options.displayName || actionCreator.name;
	options.stateSelector = options.stateSelector || (state => state.latches);
	options.keySelector = options.keySelector || ((...args) => []);
	options.max = options.max || 1;
	options.maxConcurrent = options.maxConcurrent || 1;

	return {
		execute: (...args) => {
			return function latchedActionWrapper(dispatch: Dispatch<S>, getState: () => S) {
				const latches = options.stateSelector(getState());
				const keys = options.keySelector(...args);
				const entry = getLatchEntry(latches, options.displayName, keys);

				if (canExecute(entry, options)) {
					dispatch(enterLatch(options.displayName, keys));

					var result = dispatch(actionCreator(...args)) as R;
					return Promise.resolve(result)
						.then(acResult => {
							dispatch(leaveLatch(options.displayName, keys))
							return acResult as R;
						});
				}
			}
		},
		invalidate: (...args) => {
			throw new Error('unimplmented');
		}
	}
}

export function createEnsure<R, S>(actionCreator: AsyncActionCreator<R, S>, options?: LatchOptions): AsyncActionCreator<Promise<R>, S>
export function createEnsure<R>(actionCreator: SyncActionCreator<R>, options?: LatchOptions): AsyncActionCreator<Promise<R>, any>
export function createEnsure(actionCreator: any, options?: LatchOptions): AsyncActionCreator<any, any> {
	return createLatch(actionCreator, options).execute;
}

function canExecute(entry: LatchEntry, options: LatchOptions): boolean {
	if (entry.started >= options.max)
		return false;
	else if (entry.started - entry.completed >= options.maxConcurrent)
		return false;
	else
		return true;
}

