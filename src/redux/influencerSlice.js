import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  influencers: [],
};

const influencerSlice = createSlice({
  name: "influencer",
  initialState,
  reducers: {
    setInfluencers: (state, action) => {
      state.influencers = action.payload;
    },
  },
});

export const { setInfluencers } = influencerSlice.actions;
export default influencerSlice.reducer;
