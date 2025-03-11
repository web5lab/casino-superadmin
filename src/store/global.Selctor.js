import { createSelector } from "@reduxjs/toolkit";

const globalSelector = (state) => state.global;

export const userSelector = createSelector(
  [globalSelector],
  (global) => global.user
);

