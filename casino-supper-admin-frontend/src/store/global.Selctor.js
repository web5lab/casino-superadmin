import { createSelector } from "@reduxjs/toolkit";

const globalSelector = (state) => state.global;

export const userSelector = createSelector(
  [globalSelector],
  (global) => global.user
);

export const currenciesSelector = createSelector(
  [globalSelector],
  (global) => global.currencies
);

export const casinosSelector = createSelector(
  [globalSelector],
  (global) => global.casinos
);