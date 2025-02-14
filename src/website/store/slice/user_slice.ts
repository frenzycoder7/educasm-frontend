import { createSlice } from "@reduxjs/toolkit";
import { UserContext } from "../../../types";

const _initialState: {
    user: UserContext | null,
    isLoggedIn: boolean,
} = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    isLoggedIn: localStorage.getItem('user') ? true : false,
}

const userSlice = createSlice({
    name: 'user',
    initialState: _initialState,
    reducers: {
        loginUser: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.user = action.payload;
            state.isLoggedIn = true;
        },

        getUser: (state) => {
            const user = localStorage.getItem('user');
            if (user) {
                state.user = JSON.parse(user);
                state.isLoggedIn = true;
            }
            return state
        },

        logoutUser: (state) => {
            localStorage.removeItem('user');
            state.user = null;
            state.isLoggedIn = false;
        },
    },
})

export const { loginUser, getUser, logoutUser } = userSlice.actions;
export default userSlice;