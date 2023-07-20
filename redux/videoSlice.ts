// videoSlice.js

import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: [],
  reducers: {
    setVideos: (state, action) => action.payload,
  },
});

export const { setVideos } = videoSlice.actions;
export default videoSlice.reducer;