import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  }, // [] we can use an array or use an object,
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },

    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugsRequestedFailed: (bugs, action) => {
      bugs.loading = false;
    },

    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },

    // command (is an instruction to the system and represents what need to be done) - event (represents what just happened)
    // addBug (is an instrucction, has a notion of a command) - bugAdded (has a notion of a event)
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },

    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugUnResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = false;
    },
  },
});

// EXPORT FUNCTIONS:

export const {
  // This actions should we keept inside this file. Do not use it outside, use the command notion actions.
  // This action 'll update the store and not the server.
  bugAdded,
  bugResolved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestedFailed,
  bugUnResolved,
} = slice.actions;
export default slice.reducer;

const url = "/bugs";

// THIS IS A THUNK FUNCTION, because it returns another function it doesn't return a plain object. This function 'll return our bugs from our back end
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  // This action creator returns a action object
  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestedFailed.type,
    })
  );
};

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const unResolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: false },
    onSuccess: bugUnResolved.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch", // we want to update the userId property
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

// Selector ( is a function that take the state of the store and return the computed state, some named convention for naming the selector:
// unresolvedBugsSelector , selectUnresolvedBugs)
/* export const getUnresolvedBugs = (state) =>
  state.entities.bugs.filter((bug) => !bug.resolved); */

// MEMOIZATION

// f(x) => y { input: 1, output: 2 }
// This library prevent us to have two arrays in the state memory each time we called a selector
// We can get the output read from the cache.

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );

export const getUnresolvedBugs = createSelector(
  // we can give it one or more functions
  // this is the selector function (we can add more if we want):
  (state) => state.entities.bugs, // the output of this function (wich is the list of bugs) gets passed to what we call the result function.
  // this is the result function: (here we compute the list of unresolved bugs)
  (bugs) => bugs.list.filter((bug) => !bug.resolved) // if the list of bugs is not changed this logic is not going to be executed again, this selector 'll return the result from the cache.
);

export const getResolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.list.filter((bug) => bug.resolved)
);

// Action creators
/* 
export const bugAdded = createAction("bugAdded");
export const bugResolved = createAction("bugResolved");
export const bugRemoved = createAction("bugRemoved");
 */

// Reducers - The job of a reducer is to return the new state based on this action

/* 
createReducer([], {
  // key: value
  // actions: functions (is like an event => event handler)
  bugAdded: (state, action) => {
    // this function is the second argument of the produce function in immer. Redux toolkit
    // automatically passes this function to immer for implementing an immutable update patern
    // We dont have to use the spread operator anymore. Under the hood redux toolkit uses immer, so this code gets
    // translated to an immutable update pattern.
     
  //  In immer we have a function called:
  //  produce(initialState, draftState =>{
  //   here we can write mutating code, like:
  //   draftState.x = 1;

  //  } ) second argument is a function for updating the initial state, that works as proxy. So it's going to record all the changes we're
  //  applying to it and immer is going to apply those changes to a copy of the initial state
    
    
    state.push({
      id: ++lastId,
      description: action.payload.description,
      resolved: false,
    });
  },
  bugRemoved: (state, (action) => {}),
});
*/

// WE CAN USE A SWITCH AND CASE STATEMENT (redux doesn't care)
/* 
export default function reducer(state = [], action) {
  switch (action.type) {
    case bugAdded.type:
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    case bugRemoved.type:
      return state.filter((bug) => bug.id !== action.payload.id); // we get a bug. We want to return all bugs except the bug
    // with the given id
    case bugResolved.type:
      return state.map((bug) =>
        bug.id !== action.payload.id ? bug : { ...bug, resolved: true }
      ); // if the id of the bug is not equal the id of the bug that we have resolved, we are going to return that bug otherwise
    // we are going to return a new bug object with all the properties of the existing bug, but with the updated result property.
    default:
      return state;
  }
} */

// OR USE IF AND ELSE

/* 

  function reducer(state = [], action) {
    if (action.type === "bugAdded")
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    else if (action.type === "bugRemoved")
      return state.filter((bug) => bug.id !== action.payload.id); // we get a bug. We want to return all bugs except the bug
    // with the given id
    return state;
} 

*/
