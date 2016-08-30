const LATCH_ENTER_ACTION = "LATCH_ENTER_ACTION"
const LATCH_LEAVE_ACTION = "LATCH_LEAVE_ACTION"

interface LatchPayload {
   name: string;
   keys: any[];
}

export interface LatchAction<T extends LatchPayload> {
   type: string;
   payload: T;
}

interface LatchEnterAction extends LatchAction<LatchPayload> {}
interface LatchLeaveAction extends LatchAction<LatchPayload> {}

export function IS_LATCH_ENTER(action: LatchAction<any>): action is LatchEnterAction {
   return action.type === LATCH_ENTER_ACTION;
}

export function IS_LATCH_LEAVE(action: LatchAction<any>): action is LatchLeaveAction {
   return action.type === LATCH_LEAVE_ACTION;
}

export function enterLatch(name: string, keys: any[]): LatchEnterAction {
   return { type: LATCH_ENTER_ACTION, payload: { name, keys } };
} 

export function leaveLatch(name: string, keys: any[]): LatchLeaveAction {
   return { type: LATCH_LEAVE_ACTION, payload: { name, keys } };
} 

