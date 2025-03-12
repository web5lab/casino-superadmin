import { createSelector } from "@reduxjs/toolkit";

const globalSelector = (state) => state.global;

export const currentUserSelector = createSelector(
  [globalSelector],
  (global) => global.currentUser
);

export const UserSelector = createSelector(
  [globalSelector],
  (global) => global.Users?.users
);

export const userBalanceSelector = createSelector(
  [globalSelector],
  (global) => global.currentUserBalance
);

export const currenciesSelector = createSelector(
  [globalSelector],
  (global) => global.currenecies
);
