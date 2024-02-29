import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  error: null,
  loading: false,
  currentUser: null,
  allUsers: null,
  token: null,
};

const userSlice = createSlice({
  name: "User",
  initialState: initialState,
  reducers: {
    processStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signInFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAllUsers: (state, action) => {
      state.loading = false;
      state.allUsers = action.payload;
    },
  },
});
export default userSlice.reducer;

export const {
  getAllUsers,
  updateSuccess,
  updateFailure,
  updateStart,
  signOutSuccess,
  signInFailure,
  processStart,
  signInSuccess,
  signUpSuccess,
  signUpFailure,
} = userSlice.actions;
