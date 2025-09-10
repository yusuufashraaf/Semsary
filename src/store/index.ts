import { configureStore } from "@reduxjs/toolkit";
import Authslice from './Auth/AuthSlice';
import { setStore } from '@services/axios-global';
export const store =configureStore({
    reducer:{Authslice}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;



export default store;
setStore(store);
export type AppStore = typeof store;