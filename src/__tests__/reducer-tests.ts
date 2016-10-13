import { expect } from 'chai'
import { latchReducer } from '../reducer'
import { enterLatch, leaveLatch } from '../actions'
import { getLatchEntry } from '../queries'

describe('latchReducer', () => {
	it('creates new latches on entry', () => {
		const state = latchReducer(undefined, enterLatch('latch1', []));
		expect(getLatchEntry(state, 'latch1', [])).to.not.be.undefined;
	});

	it('throws on leave if latch does not exist', () => {
		expect(() => latchReducer(undefined, leaveLatch('latch1', []))).to.throw();
	});

	it('values are zero when unentered', () => {
		const entry = getLatchEntry({}, 'latch1', []);
		expect(entry.started).to.equal(0);
		expect(entry.completed).to.equal(0);
	});

	it('increments started on each enter', () => {
		let state = latchReducer(undefined, enterLatch('latch1', []));
		let entry = getLatchEntry(state, 'latch1', []);
		expect(entry.started).to.equal(1);
		expect(entry.completed).to.equal(0);

		state = latchReducer(state, enterLatch('latch1', []));
		entry = getLatchEntry(state, 'latch1', []);
		expect(entry.started).to.equal(2);
		expect(entry.completed).to.equal(0);
	});

	it('increments completed on each leave', () => {
		let state = latchReducer(undefined, enterLatch('latch1', []));
		state = latchReducer(state, leaveLatch('latch1', []));
		let entry = getLatchEntry(state, 'latch1', []);
		expect(entry.started).to.equal(1);
		expect(entry.completed).to.equal(1);

		state = latchReducer(state, enterLatch('latch1', []));
		state = latchReducer(state, leaveLatch('latch1', []));
		entry = getLatchEntry(state, 'latch1', []);
		expect(entry.started).to.equal(2);
		expect(entry.completed).to.equal(2);
	});

	it('throws if completed > started', () => {
		let state = latchReducer(undefined, enterLatch('latch1', []));
		let entry = getLatchEntry(state, 'latch1', []);
		expect(entry.started).to.equal(1);

		state = latchReducer(state, leaveLatch('latch1', []));
		entry = getLatchEntry(state, 'latch1', []);
		expect(entry.completed).to.equal(entry.started);
		expect(() => latchReducer(state, leaveLatch('latch1', []))).to.throw();
	});

	describe("keys", () => {
		it('creates latch under string and number keys', () => {
			const state = latchReducer(undefined, enterLatch('latch1', ['key1', 42]));
			expect(getLatchEntry(state, 'latch1', ['key1', 42])).to.not.be.undefined;
		});

		it('increments started when using string and number keys', () => {
			let state = latchReducer(undefined, enterLatch('latch1', [21, 'secret']));
			let entry = getLatchEntry(state, 'latch1', [21, "secret"]);
			expect(entry.started).to.equal(1);
			expect(entry.completed).to.equal(0);

			state = latchReducer(state, enterLatch('latch1', [21, 'secret']));
			entry = getLatchEntry(state, 'latch1', [21, 'secret']);
			expect(entry.started).to.equal(2);
			expect(entry.completed).to.equal(0);
		});
	})
});