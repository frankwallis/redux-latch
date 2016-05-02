import {LatchState, LatchEntry} from './reducer';

export function getEntry(state: LatchState, name: string): LatchEntry {
   return state[name];
}

export function getSemaphore(state: LatchState, name: string): number {
   const entry = getEntry(state, name); 
   return (entry && entry.semaphore) || 0;
}

export function getFlag(state: LatchState, name: string): boolean {
   const entry = getEntry(state, name); 
   return (entry && entry.flag) || false;
}
