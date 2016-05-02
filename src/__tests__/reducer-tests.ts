import {expect} from 'chai'
import {latchReducer} from '../reducer'
import {enterLatch, leaveLatch} from '../actions'
import {getEntry, getSemaphore, getFlag} from '../queries'

describe('latchReducer', () => {
   it('creates new latches on entry', () => {
      const state = latchReducer(undefined, enterLatch('latch1'));
      expect(getEntry(state, 'latch1')).to.not.be.undefined;
   });

   it('throws on leave if latch does not exist', () => {
      expect(() => latchReducer(undefined, leaveLatch('latch1'))).to.throw();
   });

   it('semaphore is zero when unentered', () => {
      expect(getSemaphore({}, 'latch1')).to.equal(0);
   });

   it('increments semaphore on each enter', () => {
      let state = latchReducer(undefined, enterLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(1);
      state = latchReducer(state, enterLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(2);
   });

   it('decrements semaphore on each leave', () => {
      let state = latchReducer(undefined, enterLatch('latch1'));
      state = latchReducer(state, enterLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(2);
      
      state = latchReducer(state, leaveLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(1);
      state = latchReducer(state, leaveLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(0);
   });

   it('throws if semaphore would go negative', () => {
      let state = latchReducer(undefined, enterLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(1);
      
      state = latchReducer(state, leaveLatch('latch1'));
      expect(getSemaphore(state, 'latch1')).to.equal(0);
      expect(() => latchReducer(state, leaveLatch('latch1'))).to.throw();
   });
   
   it('sets flag on enter', () => {
      let state = latchReducer(undefined, enterLatch('latch1'));
      expect(getFlag(state, 'latch1')).to.be.true;
   });

   it('does not unset flag on leave', () => {
      let state = latchReducer(undefined, enterLatch('latch1'));
      state = latchReducer(state, enterLatch('latch1'));
      expect(getFlag(state, 'latch1')).to.be.true;
   });

   it('flag is false when unentered', () => {
      expect(getFlag({}, 'latch1')).to.be.false;
   });
   
});