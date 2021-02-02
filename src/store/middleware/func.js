const func = ({ dispatch, getState }) => (next) => (action) => {
  // this store is not the store object in redux, it only looks like it.
  // some people prefer to write ({ getState, dispatch }) instead of store

  if (typeof action === "function") action(dispatch, getState);
  else next(action);
};

export default func;
