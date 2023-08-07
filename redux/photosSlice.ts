// photoSlice.js

import { createSlice } from "@reduxjs/toolkit";

const photosSlice = createSlice({
  name: "photos",
  initialState: [],
  reducers: {
    setPhotos: (state, action) => action.payload,
  },
});

export const { setPhotos } = photosSlice.actions;
export default photosSlice.reducer;
