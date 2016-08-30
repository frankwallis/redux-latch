import {expect} from 'chai'
import {createMockStore, testSyncActionCreator, testAsyncActionCreator} from './mock-store'

import {runOnce} from '../index';

describe('Action Enhancers', () => {
   describe('runOnce', () => {
      it('passes the correct arguments to underlying sync action', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testSyncActionCreator);         

         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

      it('receives the response from the sync action', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testSyncActionCreator);         

         const runOnceAction = runOnceActionCreator('london', 80)
         const result = await store.dispatch(runOnceAction);
       
         expect(result).to.deep.equal({ 
            type: "TEST_ACTION", 
            payload: { arg1: 'london', arg2: 80 } 
         });
      });

      it('prevents sync action being run again', async () => {
         const store = createMockStore();
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
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator);         
         
         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
      });

      it('receives the response from the async action', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator);         

         const runOnceAction = runOnceActionCreator('london', 80)
         const result = await store.dispatch(runOnceAction);
       
         expect(result).to.equal('testAsyncActionCreatorResult'); 
      });

      it('prevents async action being run again', async () => {
         const store = createMockStore();
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

      it('defaults displayName to "latch_[epochtime]"', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator)

         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);       
         const latchNames = Object.keys(store.getState().latches);

         expect(latchNames).to.have.length(1);
         expect(latchNames[0].indexOf('latch_')).to.equal(0);
      });

      it('uses displayName to name the latch', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator, {
            displayName: 'testLatchName1'
         });         
         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);       
         const latchNames = Object.keys(store.getState().latches);

         expect(latchNames).to.have.length(1);
         expect(latchNames[0].indexOf('testLatchName1_')).to.equal(0);
      });

      it('uses key selector to get the keys', async () => {
         const store = createMockStore();
         const runOnceActionCreator = runOnce(testAsyncActionCreator, {
            keySelector: (...args) => args
         });         

         const runOnceAction = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction);
       
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);
         
         const runOnceAction2 = runOnceActionCreator('london', 80)
         await store.dispatch(runOnceAction2);
         
         expect(store.getState().calls).to.have.length(1);
         expect(store.getState().calls[0].arg1).to.be.equal('london');
         expect(store.getState().calls[0].arg2).to.be.equal(80);

         const runOnceAction3 = runOnceActionCreator('madrid', 80)
         await store.dispatch(runOnceAction3);
         
         expect(store.getState().calls).to.have.length(2);
         expect(store.getState().calls[1].arg1).to.be.equal('madrid');
         expect(store.getState().calls[1].arg2).to.be.equal(80);

         const runOnceAction4 = runOnceActionCreator('london', 85)
         await store.dispatch(runOnceAction4);
         
         expect(store.getState().calls).to.have.length(3);
         expect(store.getState().calls[2].arg1).to.be.equal('london');
         expect(store.getState().calls[2].arg2).to.be.equal(85);
      });
   });   
});