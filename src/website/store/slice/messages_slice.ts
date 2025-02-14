import { createSlice } from "@reduxjs/toolkit"
import { IExploreContent } from "../../apis/response_interfaces/explore-data.interface"

const _initialState: {
    messages: IExploreContent[]
    loadingMessageId: string | null
    isLoading: boolean
    history: string[]
} = {
    messages: [],
    loadingMessageId: null,
    isLoading: false,
    history: localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history') || '') : []
}

const messagesSlice = createSlice({
    name: 'messages',
    initialState: _initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        removeMessage: (state, action) => {
            state.messages = state.messages.filter(message => message.messageId !== action.payload);
        },

        clearMessages: (state) => {
            state.messages = [];
        },
        setLoadingMessageId: (state, action) => {
            state.loadingMessageId = action.payload.messageId;
            state.isLoading = action.payload.isLoading;
        },
        addMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },
        addHistory: (state, action) => {
            state.history.push(action.payload);
            localStorage.setItem('history', JSON.stringify(state.history));
        },
        clearHistory: (state) => {
            state.history = [];
            localStorage.removeItem('history');
        }
    }
})

export const { addMessage, removeMessage, clearMessages, addMessages, setLoadingMessageId, addHistory, clearHistory } = messagesSlice.actions;
export default messagesSlice;