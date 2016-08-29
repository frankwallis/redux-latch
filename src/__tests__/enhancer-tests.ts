import {expect} from 'chai'
import {latchReducer, LatchState} from '../reducer'
import {Store, Dispatch, createStore as reduxCreateStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

import {runOnce} from '../index';

interface GlobalState {
   calls: TestState;
   latches: LatchState;
} 

export function createStore(): Store<GlobalState> {
   /* combine all our reducers into a single function */
   const reducer = combineReducers({
      latches: latchReducer,
      calls: testReducer
   });

   /* generate a createStore method by composing the middleware functions we need */
   const finalCreateStore = compose(applyMiddleware(thunk))(reduxCreateStore);
   
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

function testAsyncActionCreator(arg1: string, arg2: number) {
   return function (dispatch: Function, getState: () => GlobalState) {
      dispatch(testSyncActionCreator(arg1, arg2));         
   }   
}

function testSyncActionCreator(arg1: string, arg2: number) {
   return { type: "TEST_ACTION", payload: { arg1, arg2 } };
}

describe('Action Enhancers', () => {
   describe('runOnce', () => {
      it('passes the correct arguments to underlying sync action', async () => {
         const store = createStore();
         const runOnceActionCreator = runOnce(testSyncActionCreator);         

         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

      it('prevents sync action being run again', async () => {
         const store = createStore();
         const runOnceActionCreator = runOnce(testSyncActionCreator);         
         
         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
         
         const runOnceAction2 = runOnceActionCreator('madrid', 86)
         await store.dispatch(runOnceAction2);
         
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

      it('passes the correct arguments to underlying async action', async () => {
         const store = createStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator);         
         
         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

      it('prevents async action being run again', async () => {
         const store = createStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator);         

         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
         
         const runOnceAction2 = runOnceActionCreator('madrid', 86)
         await store.dispatch(runOnceAction2);
         
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

   });   
});