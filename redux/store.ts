// store.js

import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./groupSlice";
import videosReducer from "./videosSlice";
import photosReducer from "./photosSlice";
import agencyReducer from "./agencySlice";

const store = configureStore({
  reducer: {
    group: groupReducer,
    agency: agencyReducer,
    videos: videosReducer,
    photos: photosReducer,
  },
});

export default store;
