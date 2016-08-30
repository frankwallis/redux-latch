import {latchReducer, LatchState} from '../reducer'
import {Store, Dispatch, createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

interface GlobalState {
   calls: TestState;
   latches: LatchState;
}

export function createMockStore(): Store<GlobalState> {
   /* combine all our reducers into a single function */
   const reducer = combineReducers({
      latches: latchReducer,
      calls: testReducer
   });

   /* generate a createStore method by composing the middleware functions we need */
   const finalCreateStore = compose(applyMiddleware(thunk))(createStore);

   /* create the store */
   return finalCreateStore(reducer, {}) as any as Store<GlobalState>;
}

type TestState = Array<{ arg1: string, arg2: number }>

function testReducer(state: TestState = [], action: any) {
   if (action.type === "TEST_ACTION")
      return state.concat(action.payload);
   else
      return state;
}

export function testSyncActionCreator(arg1: string, arg2: number) {
   return { type: "TEST_ACTION", payload: { arg1, arg2 } };
}

export function testAsyncActionCreator(arg1: string, arg2: number) {
   return function (dispatch: Function, getState: () => GlobalState) {
      dispatch(testSyncActionCreator(arg1, arg2));
      return 'testAsyncActionCreatorResult';
   }
}
