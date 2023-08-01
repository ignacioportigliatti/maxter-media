import { createSlice } from "@reduxjs/toolkit";
import { Agency } from "@prisma/client";

const initialState: Agency[] = []

const agenciesSlice = createSlice({
  name: "agencies",
  initialState: initialState,
  reducers: {
    setAgencies: (state, action) => action.payload,
  },
});

export const { setAgencies } = agenciesSlice.actions;
export default agenciesSlice.reducer;