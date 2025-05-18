import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const user = action.payload.user;
      state.user = {
        ...user,
        friends: Array.isArray(user.friends) ? user.friends : [],
      };
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = Array.isArray(action.payload.friends)
          ? action.payload.friends
          : [];
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload.posts];
    },
    setPost: (state, action) => {
      const updatedPost = action.payload.post;
      const updatedPosts = state.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      state.posts = updatedPosts;
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    // ✅ New action
    setUser: (state, action) => {
      state.user = {
        ...action.payload,
        friends: Array.isArray(action.payload.friends)
          ? action.payload.friends
          : [],
      };
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  addPosts,
  setPost,
  removePost,
  setUser, // ✅ add this
} = authSlice.actions;

export default authSlice.reducer;
