redux-latch
============================
Redux library for controlling action creator execution

[![build status](https://secure.travis-ci.org/frankwallis/redux-latch.png?branch=master)](http://travis-ci.org/frankwallis/redux-latch)

## Overview ##

A common pattern in Redux is using flags to signal that an asynchronous action-creator is currently executing or has been executed, the flags are used to prevent action-creators running simultaneously or to prevent them from running multiple times. redux-latch provides a set of higher-order actions which enable you to handle these situations more declaratively.

As an example say you have an action-creator which you want to only run once after the user has logged in, it might look something like this:

```
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

```
function loadUserPermissions(username) {
   return (dispatch, getState) => {      
      api.fetchUserPermissions()
         .then(permissions => {
            dispatch({ type: SET_USER_PERMISSIONS, payload: permissions });
         })
   }
}
```
Calling ```runOnce``` on this action-creator will return a new action-creator which wraps the original and ensures that it only executes once.

```
import {runOnce} from 'redux-latch';
const ensureUserPermissions = runOnce(loadUserPermissions);    
```

Then just use the ```ensureUserPermissions``` action-creator to trigger the load instead. redux-latch maintains all of its state in the redux store, so isomorphism and time-travelling are both handled. 

## Usage ##

Create the latch reducer:
```
import {createLatchReducer} from 'redux-latch';

const combined = combineReducers({
   latches: createLatchReducer(),
   products: productReducer,
   users: userReducer
});
```

Then in your asynchronous action creators:

## Higher-Order Actions ##