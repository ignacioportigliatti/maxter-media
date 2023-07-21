// photoSlice.js

import { createSlice } from "@reduxjs/toolkit";

const photoSlice = createSlice({
  name: "photos",
  initialState: [],
  reducers: {
    setPhotos: (state, action) => action.payload,
  },
});

export const { setPhotos } = photoSlice.actions;
export default photoSlice.reducer;
