// photoSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { Agency } from "@prisma/client";

const initialState: Agency = {
    id: "",
    name: "",
    location: "",
    phone: "",
    email: "",
    logoSrc: "",
    groupIds: [],
}

const agencySlice = createSlice({
  name: "agency",
  initialState: initialState,
  reducers: {
    setAgency: (state, action) => action.payload,
  },
});

export const { setAgency } = agencySlice.actions;
export default agencySlice.reducer;