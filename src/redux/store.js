import { configureStore } from "@reduxjs/toolkit";
import influencerReducer from "./influencerSlice";

export const store = configureStore({
  reducer: {
    influencer: influencerReducer,
  },
});

export default store;
