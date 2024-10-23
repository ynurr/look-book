import { configureStore } from "@reduxjs/toolkit";
import detailSlice from './slices/detailSlice';
import searchSlice from "./slices/searchSlice";
import listSlice from "./slices/listSlice";

export const store = configureStore({
	reducer: {
		detail: detailSlice,
		search: searchSlice,
		list: listSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;