import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  friends: [],
  messages: [],
  error: null,
};

const chatSlice = createSlice({
  name: "Friends",
  initialState: initialState,
  reducers: {
    getFriendsStart: (state) => {
      state.loading = true;
    },
    getFriendsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getFriendsSuccess: (state, action) => {
      state.loading = false;
      state.friends = action.payload;
      state.error = null;
    },
    getMessagesStart: (state) => {
      state.loading = true;
    },
    getMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    sendMessagesStart: (state) => {
      state.loading = true;
    },
    sendMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
      state.error = null;
    },
    sendMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = [...state.messages, action.payload];
      state.error = null;
    },
  },
});
export default chatSlice.reducer;

export const {
  sendMessagesFailure,
  sendMessagesStart,
  sendMessagesSuccess,
  getFriendsFailure,
  getFriendsStart,
  getFriendsSuccess,
  getMessagesFailure,
  getMessagesStart,
  getMessagesSuccess,
} = chatSlice.actions;
