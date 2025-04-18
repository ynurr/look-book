import { configureStore } from "@reduxjs/toolkit";
import detailSlice from './slices/detailSlice';
import searchSlice from "./slices/searchSlice";
import listSlice from "./slices/listSlice";
import authorBooksSlice from "./slices/authorBooksSlice";
import wishlistSlice from "./slices/wishlistSlice"
import readingSlice from "./slices/readingSlice"
import reviewSlice from "./slices/reviewSlice"
import readingDetailSlice from "./slices/readingDetailSlice"
import inquirySlice from "./slices/inquirySlice"
import likeSlice from "./slices/likeSlice"
import commentSlice from "./slices/commentSlice"
import accountSlice from "./slices/accoutSlice"
import statSlice from "./slices/statSlice"

export const store = configureStore({
	reducer: {
		detail: detailSlice,
		authorBooks: authorBooksSlice,
		search: searchSlice,
		list: listSlice,
		wishlist: wishlistSlice,
		readingStatus: readingSlice,
		review: reviewSlice,
		readingDetail: readingDetailSlice,
		inquiry: inquirySlice,
		like: likeSlice,
		comment: commentSlice,
		account: accountSlice,
		stat: statSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;