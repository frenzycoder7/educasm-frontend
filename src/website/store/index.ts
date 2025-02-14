import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user_slice";
import messagesSlice from "./slice/messages_slice";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        messages: messagesSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;