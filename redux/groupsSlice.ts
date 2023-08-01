// groupsSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { Group } from "@prisma/client";

const initialState: Group[] = []

const groupsSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {
    setGroups: (state, action) => action.payload,
    getGroups: (state, action) => state,
  },
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;