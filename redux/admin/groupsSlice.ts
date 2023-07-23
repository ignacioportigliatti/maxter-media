// photoSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { Group } from "@prisma/client";

const initialState: Group = {
    id: "",
    name: "",
    school: "",
    coordinator: "",
    agencyId: "",
    agencyName: "",
    entry: "",
    exit: "",
    photosIds: [],
    videoIds: [],
}

const groupsSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {
    setAgency: (state, action) => action.payload,
  },
});

export const { setAgency } = groupsSlice.actions;
export default groupsSlice.reducer;