// store.js

import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./groupSlice";
import videoReducer from "./videoSlice";
import photoReducer from "./photoSlice";

const store = configureStore({
  reducer: {
    group: groupReducer,
    video: videoReducer,
    photo: photoReducer,
  },
});

export default store;
