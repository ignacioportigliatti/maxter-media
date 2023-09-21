// groupSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const codeSlice = createSlice({
  name: "code",
  initialState: initialState,
  reducers: {
    setReduxCode: (state, action) => action.payload,
  },
});

export const { setReduxCode } = codeSlice.actions;
export default codeSlice.reducer;
