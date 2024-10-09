import { configureStore } from "@reduxjs/toolkit";
import detailReducer from './slices/detailSlice';
import searchSlice from "./slices/searchSlice";

export const store = configureStore({
	reducer: {
		detail: detailReducer,
		search: searchSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;