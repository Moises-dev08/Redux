const logger = (param) => (store) => (next) => (action) => {
  // this store is not the store object in redux, it only looks like it.
  // some people prefer to write ({ getState, dispatch }) instead of store
  console.log("Logging", param);

  return next(action);
};
export default logger;
