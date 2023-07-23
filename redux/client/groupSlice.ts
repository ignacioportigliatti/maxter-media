// groupSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { Group } from "@prisma/client";

const initialState: Group = {
  id: "",
  name: "",
  coordinator: "",
  school: "",
  entry: "",
  exit: "",
  agencyId: "",
  agencyName: "",
  photosIds: [""],
  videoIds: [""],
};

const groupSlice = createSlice({
  name: "group",
  initialState: initialState,
  reducers: {
    setGroup: (state, action) => action.payload,
  },
});

export const { setGroup } = groupSlice.actions;
export default groupSlice.reducer;
