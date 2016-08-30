interface LatchPayload {
   name: string;
   keys: any[];
}

interface LatchEnterAction {
    type: "LATCH_ENTER";
    payload: LatchPayload;
}

interface LatchLeaveAction {
    type: "LATCH_LEAVE";
    payload: LatchPayload;
}

export type LatchAction = LatchEnterAction | LatchLeaveAction

export function enterLatch(name: string, keys: any[]): LatchEnterAction {
   return { type: "LATCH_ENTER", payload: { name, keys } };
} 

export function leaveLatch(name: string, keys: any[]): LatchLeaveAction {
   return { type: "LATCH_LEAVE", payload: { name, keys } };
} 

