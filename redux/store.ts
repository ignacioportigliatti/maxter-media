// store.js

import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./groupSlice";
import videoQueueReducer from "./videoQueueSlice";
import photosReducer from "./photosSlice";
import agencyReducer from "./agencySlice";
import groupsReducer from "./groupsSlice";
import agenciesReducer from "./agenciesSlice";


const clientStore = configureStore({
  reducer: {
    agencies: agenciesReducer,
    groups: groupsReducer,
    group: groupReducer,
    agency: agencyReducer,
    videoQueue: videoQueueReducer,
    photos: photosReducer,
  },
});

export default clientStore;
