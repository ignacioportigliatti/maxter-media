// groupSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const codeSlice = createSlice({
  name: "code",
  initialState: initialState,
  reducers: {
    setCode: (state, action) => action.payload,
  },
});

export const { setCode } = codeSlice.actions;
export default codeSlice.reducer;
