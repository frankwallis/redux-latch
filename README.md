redux-latch
============================
Redux library for controlling action creator execution

[![build status](https://secure.travis-ci.org/frankwallis/redux-latch.png?branch=master)](http://travis-ci.org/frankwallis/redux-latch)

## Overview ##

A common pattern in Redux is to use flags to indicate that an action-creator is executing or has executed
to prevent it running multiple times. redux-latch is a library to enable this to be handled declaratively.

As an example say you have an action-creator which you want to only run once after the user has logged in, 
it might look something like this:

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

With redux-latch you can remove the flags from the action-creator and the store:

```
function loadUserPermissions(username) {
   return (dispatch, getState) => {      
      fetchUserPermissions()
         .then(permissions => {
            dispatch({ type: SET_USER_PERMISSIONS, payload: permissions });
         })
   }
}
```
and then get redux-latch to ensure that it only runs once:

```
import {runOnce} from 'redux-latch';
const ensureUserPermissions = runOnce(loadUserPermissions);    
```

Then just use the ```ensureUserPermissions``` action-creator instead.

## Usage ##

Create the latch reducer:
```
import {latchReducer} from 'redux-latch';

const combined = combineReducers({
   latches: createLatchReducer(),
   products: productReducer,
   users: userReducer
});
```

Then in your asynchronous action creators:  