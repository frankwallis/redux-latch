import {IS_LATCH_ENTER, IS_LATCH_LEAVE} from './actions'

export interface LatchEntry {
   semaphore: number;
   flag: boolean;
}

export type LatchState = { [latchId: string]: LatchEntry };

const initialState = {} as LatchState;

export function latchReducer(state: LatchState, action: any) {
   state = state || initialState;
   
   if (IS_LATCH_ENTER(action)) {
      let entry = state[action.payload.name];
      
      if (entry) {
         // TODO - assertion here.
         entry = { semaphore: entry.semaphore + 1, flag: true };         
      }
      else {
         entry = { semaphore: 1, flag: true };
      }
      const result = Object.assign({}, state);
      result[action.payload.name] = entry;
      return result;
   }
   else if (IS_LATCH_LEAVE(action)) {
      let entry = state[action.payload.name];
      if (!entry) throw new Error("Latch [" + action.payload.name + "] was not found");
      if (entry.semaphore <= 0) throw new Error("Latch [" + action.payload.name + "] was released without being acquired");
      entry = { semaphore: entry.semaphore - 1, flag: true };         
      
      const result = Object.assign({}, state);
      result[action.payload.name] = entry;
      return result;
      
   }
   else {
      return state;
   }
}

