import { createSlice } from "@reduxjs/toolkit";

const initialState = { selectedTeam: { id: -1, name: "-" } };

const slice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam(state, action) {
      state.selectedTeam = action.payload;
      return state;
    },
  },
});

export default slice;

export const { setTeam } = slice.actions;

export const getTeam = (state) => {
  return state.team.selectedTeam;
};
