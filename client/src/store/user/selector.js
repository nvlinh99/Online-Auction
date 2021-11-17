export const selectCurrentUser = (state) => state.user.currentUser
export const selectCurrentUserLoading = (state) =>
  state.user.isCurrentUserLoading
export const selectIsTogglingWatchList = (state) =>
  state.user.isTogglingWatchList
export const selectIsWaitingForLoadUser = (state) =>
  state.user.isWaitingForLoadUser
