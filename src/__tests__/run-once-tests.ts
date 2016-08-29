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

   });   
});