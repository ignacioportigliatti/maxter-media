// store.js

import { configureStore } from "@reduxjs/toolkit";
import groupsReducer from "./groupsSlice";

const adminStore = configureStore({
  reducer: {
    groups: groupsReducer,
  },
});

export default adminStore;
