import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";

export default function () {
  return configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(), // this functions returns an array of middleware functions, we copy this array and then we add extra middleware functions0.
      //logger({ destination: "console" }),
      toast,
      api,
    ],
  }); // here we have to specify the root reducer
}

// This configureStore() would automatically set up our store to talk to Redux dev tools.
// It also alllows us to dispatch async actions.
