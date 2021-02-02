// MOCKING HTTP CALLS:
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  loadBugs,
  addBug,
  resolveBug,
  getUnresolvedBugs,
  bugsRequested,
} from "../bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  // this function takes a function as an argument and executes this function before each test.
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore(); // here we have a real store object with all the middleware functions.
  });

  // Helper function:
  const bugsSlice = () => store.getState().entities.bugs;

  describe("loading bugs", () => {
    describe("if the bugs exist in the cache.", () => {
      it("they should not be fetched from the server again.", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());
        expect(fakeAxios.history.get.length).toBe(1);
      });
    });
    describe("if the bugs don't exist in the cache.", () => {
      describe("loading indicator", () => {
        it("should be true while fetching the bugs", () => {
          fakeAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, { id: 1 }];
          });

          store.dispatch(loadBugs());
        });

        it("should be false after the bugs are fetched", async () => {
          fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it("should add the bug to the store if it's save to the server", async () => {
          // Arrange
          const bug = { description: "a" }; // simple bug object
          const savedBug = { ...bug, id: 1 };
          fakeAxios.onPost("/bugs").reply(200, savedBug); // in this second argument we pased a object that is going to be in the body of the response.

          // Act
          await store.dispatch(addBug(bug)); // we dispatch an action

          // Assert
          expect(bugsSlice().list).toContainEqual(savedBug);
        });

        it("should not add the bug to the store if it's not save to the server", async () => {
          // Arrange
          const bug = { description: "a" }; // simple bug object

          fakeAxios.onPost("/bugs").reply(500);

          // Act
          await store.dispatch(addBug(bug)); // we dispatch an action

          // Assert
          expect(bugsSlice().list).toHaveLength(0);
        });

        it("should mark the bug as resolved if it's saved to the server", async () => {
          fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
          fakeAxios.onPost("/bugs").reply(200, { id: 1 });

          await store.dispatch(addBug({})); // we dispatch an action
          await store.dispatch(resolveBug(1)); // we dispatch an action

          expect(bugsSlice().list[0].resolved).toBe(true);
        });

        it("should not mark the bug as resolved if it's not saved to the server", async () => {
          fakeAxios.onPatch("/bugs/1").reply(500);
          fakeAxios.onPost("/bugs").reply(200, { id: 1 });

          await store.dispatch(addBug({})); // we dispatch an action
          await store.dispatch(resolveBug(1)); // we dispatch an action

          expect(bugsSlice().list[0].resolved).not.toBe(true);
        });

        it("should set the load property to true if the bug is requested", async () => {
          fakeAxios.onPost("/bugs").reply(200);

          await store.dispatch(bugsRequested(1));
        });

        it("should be false if the server returns an error", async () => {
          fakeAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });
});

describe("selectors", () => {
  const createStore = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("getUnresolvedBugs", async () => {
    const state = createStore();
    state.entities.bugs.list = [
      { id: 1, resolved: true },
      { id: 2 },
      { id: 3 },
    ];
    const result = getUnresolvedBugs(state);

    expect(result).toHaveLength(2);
  });
});

/* 
// INTEGRATION TEST BECAUSE IS TALKING TO A BACK END SERVICES:

import { addBug } from "../bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  it("should handle the addBug action", async () => {
    const store = configureStore(); // here we have a a real store object with all the middleware functions
    const bug = { description: "a" }; // simple bug object
    await store.dispatch(addBug(bug)); // we dispatch an action
    expect(store.getState().entities.bugs.list).toHaveLenght(1);
  });
});


SOLITARY TEST:

import { addBug, bugAdded } from "../bugs";
import { apiCallBegan } from "../api";
import { configureStore } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { MockAdapter } from 'axios-mock-adapter';
import { MockAdapter } from 'axios-mock-adapter';
import { loadBugs } from './../bugs';
import { loadBugs } from './../../../../redux-finish/src/store/bugs';

describe("bugsSlice", () => {
  describe("action creators", () => {
    it("addBug", () => {
      const bug = { description: "a" };
      const result = addBug(bug);
      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bug,
          onSuccess: bugAdded.type,
        },
      };
      expect(result).toEqual(expected);
    });
  });
});
 */
