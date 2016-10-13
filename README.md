redux-latch
============================
A Redux library for restricting and synchronising action-creator execution

[![build status](https://secure.travis-ci.org/frankwallis/redux-latch.png?branch=master)](http://travis-ci.org/frankwallis/redux-latch)

## Overview ##

A common pattern in Redux is using flags to signal that an asynchronous action-creator is currently executing or has been executed, the flags are used to prevent action-creators running simultaneously or to prevent them from running multiple times. redux-latch provides a set of higher-order actions which enable you to handle these situations more declaratively.

As an example say you have an action-creator which you want to only run once after the user has logged in, it might look something like this:

```ts
function loadUserPermissions(username) {
   return (dispatch, getState) => {
      const userStore = getState().userStore;
       
      if (userStore.permissionsLoading || userStore.permissions)
         return;
         
      dispatch({ type: USER_PERMISSIONS_LOADING, payload: true });
      
      return fetchUserPermissions()
         .then(permissions => {
            dispatch({ type: SET_USER_PERMISSIONS, payload: permissions });
            dispatch({ type: USER_PERMISSIONS_LOADING, payload: false });
         })
   }
}
```

Using the ```runOnce``` higher-order action provided by redux-latch you can remove the ad-hoc flags from the store, and simplify the action-creator so that it simply performs the fetch:

```ts
function loadUserPermissions(username) {
   return (dispatch, getState) => {      
      api.fetchUserPermissions()
         .then(permissions => {
            dispatch({ type: SET_USER_PERMISSIONS, payload: permissions });
         })
   }
}
```
Calling ```createEnsure``` on this action-creator will return a new action-creator which wraps the original and ensures that it is only ever executed once.

```ts
import {createEnsure} from 'redux-latch';
const ensureUserPermissions = createEnsure(loadUserPermissions);    
```

Then in your code, just use the ```ensureUserPermissions``` action-creator to trigger the fetch instead. redux-latch maintains all of its state inside the redux store, so isomorphism and time-travelling are both handled. 

## Usage ##

You need to initialise the latch reducer where redux-latch will hold its state, by default redux-latch will expect this to be located at ```state.latches```, however this can be overridden.

```ts
import {latchReducer} from 'redux-latch';

const combined = combineReducers({
   latches: latchReducer,
   products: productReducer,
   users: userReducer
});
```

redux-latch also depends on the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware being present.

## Higher-Order Actions ##

#### createLatch ####

Will enhance the action-creator so that it is never called more than N times. You can also specify the number of concurrent exections allowed. The function returns a ```Latch``` object with an ```execute``` method to trigger the action-creator and an ```invalidate``` method to reset the latch.

```ts
function createLatch(actionCreator: ActionCreator, options?: LatchOptions): Latch;

interface Latch {
	execute: ActionCreator;
	invalidate: (...args) => void;
}

interface LatchOptions {
   displayName?: string;
   stateSelector?: (state: any) => LatchState;
   keySelector?: (...args) => any[];
	max?: number;
	maxConcurrent?: number;
}
```

#### createEnsure ####

Just returns the execute methods of the latch. Useful if you never want to call ```invalidate```.
