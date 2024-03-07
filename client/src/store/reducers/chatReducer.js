import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  friends: [],
  messages: [],
  error: null,
  sentSuccess: false,
  getSuccess: false,
  theme: localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : "light",
  newUserAdd: "",
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
      state.getSuccess = true;
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
      state.friends[index].lMsg = action.payload.msg;
      //state.friends[index].lMsg.status = action.payload.status;
    },
    seenMessageUpdate: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.senderId ||
          frnd.frndInfo._id === action.payload?.receiverId
      );
      state.friends[index].lMsg.status = "seen";
    },
    deliverMessageUpdate: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) =>
          frnd.frndInfo._id === action.payload?.senderId ||
          frnd.frndInfo._id === action.payload?.receiverId
      );
      state.friends[index].lMsg.status = "delivered";
    },
    seenAll: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) => frnd.frndInfo._id === action.payload?.receiverId
      );
      state.friends[index].lMsg.status = "seen";
    },
    sentSuccessClear: (state) => {
      state.sentSuccess = false;
    },
    updateFriend: (state, action) => {
      const index = state.friends.findIndex(
        (frnd) => frnd.frndInfo._id === action.payload
      );
      if (state.friends[index].lMsg) {
        state.friends[index].lMsg.status = "seen";
      }
    },
    getSuccessClear: (state) => {
      state.getSuccess = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    logoutSuccess: (state) => {
      state.friends = [];
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    newUserAddSet: (state, action) => {
      state.newUserAdd = action.payload;
    },
    newUserAddClear: (state) => {
      state.newUserAdd = "";
    },
  },
});
export default chatSlice.reducer;

export const {
  seenAll,
  newUserAddClear,
  newUserAddSet,
  logoutSuccess,
  setTheme,
  getSuccessClear,
  updateFriend,
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
