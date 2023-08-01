// videoSlice.js

import { Group } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import Uppy, { UppyFile } from "@uppy/core";

interface VideoQueue {
  videoQueue: [];
  selectedGroup: Group;
}

const videoQueueSlice = createSlice({
  name: "videoQueue",
  initialState: {
    videoQueue: [],
    selectedGroup: {},
  } as VideoQueue,
  reducers: {
    setVideoQueue: (state, action) => action.payload,
  },
});

export const { setVideoQueue } = videoQueueSlice.actions;
export default videoQueueSlice.reducer;