import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  friends: [],
  messages: [],
  error: null,
  sentSuccess: false,
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
      state.sentSuccess = true;
    },
    updateFriendMessage: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.senderId ||
          frnd.frndInfo._id === action.payload?.receiverId
      );
      if (index !== -1) {
        state.friends[index].lMsg = action.payload;
      }
    },
    updateFriendMessageStatus: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.msg?.senderId ||
          frnd.frndInfo._id === action.payload?.msg?.receiverId
      );
      if (index !== -1) {
        state.friends[index].lMsg = action.payload;
        state.friends[index].lMsg.status = action.payload.status;
      }
    },
    seenMessageUpdate: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.senderId ||
          frnd.frndInfo._id === action.payload?.receiverId
      );
      if (index !== -1) {
        state.friends[index].lMsg.status = "seen";
      }
    },
    deliverMessageUpdate: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.senderId ||
          frnd.frndInfo._id === action.payload?.receiverId
      );
      if (index !== -1) {
        state.friends[index].lMsg.status = "delivered";
      }
    },
    sentSuccessClear: (state) => {
      state.sentSuccess = false;
    },
  },
});
export default chatSlice.reducer;

export const {
  updateFriendMessageStatus,
  deliverMessageUpdate,
  seenMessageUpdate,
  sentSuccessClear,
  updateFriendMessage,
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
