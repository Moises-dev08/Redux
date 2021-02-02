import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  loadBugs,
  getUnresolvedBugs,
  getResolvedBugs,
  resolveBug,
  unResolveBug,
} from "./../store/bugs";

const BugsList = () => {
  const dispatch = useDispatch();
  // With this hook we can select a slice of our store.
  // Here we are going to get the [] of unResolvedBugs.
  const bugs = useSelector(getUnresolvedBugs);

  // This is a hook function that allows us to tap into lifecycle methods in function components.
  // This function is where we write code to perform side effects, like calling API's.
  // React automatically calls this function every time it renders our component.
  useEffect(() => {
    // The code that we write here is equivalent to the code that we write in com did mount
    dispatch(loadBugs());
  }, []); // We can pass one or more objects or dependecies here and if one of these objects that are passed in this [] change react is going to call useEffect() again.
  // We are passing an empty [] because we want this function to be called once, when our component is mounted and not multiple times.

  return (
    <ul>
      {bugs.map((bug) => (
        <li key={bug.id}>
          {bug.description}
          <button onClick={() => dispatch(unResolveBug(bug.id))}>
            unresolve
          </button>
        </li>
      ))}
    </ul>
  );
};
export default BugsList;
