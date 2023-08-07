// photoSlice.js

import { createSlice } from "@reduxjs/toolkit";

const videosSlice = createSlice({
  name: "videos",
  initialState: [],
  reducers: {
    setVideos: (state, action) => action.payload,
  },
});

export const { setVideos } = videosSlice.actions;
export default videosSlice.reducer;
