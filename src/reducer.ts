import {LatchAction} from './actions'

export interface LatchEntry {
   started: number;
   completed: number;
   lastStarted: Date;
   lastCompleted: Date;
}

export type LatchNode = LatchMap | LatchEntry
export type LatchMap = { [latchId: string]: LatchNode };
export type LatchState = LatchMap;

const initialState = {} as LatchState;
export const emptyLatch = {
   started: 0,
   completed: 0,
   lastStarted: undefined,
   lastCompleted: undefined
}

function updateLatch(state: LatchState, name: string, keys: any[], updater: (state: LatchEntry) => LatchEntry): LatchState {
   return setLatch(state, [name].concat(keys), updater) as LatchMap;
}

function setLatch(state: LatchNode, keys: any[], updater: (state: LatchEntry) => LatchEntry): LatchNode {
   if (keys.length === 0) {
      state = state || emptyLatch; 
      return updater(state as LatchEntry);
   }
   else {
      const key = keys[0];
      const result = Object.assign({}, state);
      result[key] = setLatch(result[key], keys.slice(1), updater);
      return result; 
   }
}

export function latchReducer(state: LatchState, action: LatchAction): LatchState {
   state = state || initialState;
   
   switch(action.type) {
      case "LATCH_ENTER": {
         return updateLatch(state, action.payload.name, action.payload.keys, (entry => {
            return {
               started: entry.started + 1,
               completed: entry.completed,
               lastStarted: new Date(),
               lastCompleted: entry.lastCompleted
            }
         }));
      }
      case "LATCH_LEAVE": {
         return updateLatch(state, action.payload.name, action.payload.keys, (entry => {
            if (entry.completed >= entry.started)
               throw new Error("Latch was completed without being started");

            return {
               started: entry.started,
               completed: entry.completed + 1,
               lastStarted: entry.lastStarted,
               lastCompleted: new Date()
            }
         }));
      }
      default: {
         return state;
      }
   }
}

