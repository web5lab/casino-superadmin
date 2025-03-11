import { createSelector } from "@reduxjs/toolkit";

const globalSelector = (state) => state.global;

export const logedInSelector = createSelector(
  [globalSelector],
  (global) => global.logedIn
);
