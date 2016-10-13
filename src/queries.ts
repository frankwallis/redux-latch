import { LatchState, LatchEntry, emptyLatch } from './reducer'

export function getLatchEntry(state: LatchState, name: string, keys: any[]): LatchEntry {
	const result = keys.reduce((node, key) => node && node[key], state[name]);
	return result || emptyLatch;
}
