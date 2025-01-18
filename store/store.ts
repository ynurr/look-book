import { configureStore } from "@reduxjs/toolkit";
import detailSlice from './slices/detailSlice';
import searchSlice from "./slices/searchSlice";
import listSlice from "./slices/listSlice";
import authorBooksSlice from "./slices/authorBooksSlice";
import wishlistSlice from "./slices/wishlistSlice"
import addWishlistSlice from "./slices/addWishlistSlice"
import removeWishlistSlice from "./slices/removeWishlistSlice"
import readingSlice from "./slices/readingSlice"
import reviewSlice from "./slices/reviewSlice"
import readingDetailSlice from "./slices/readingDetailSlice"

export const store = configureStore({
	reducer: {
		detail: detailSlice,
		authorBooks: authorBooksSlice,
		search: searchSlice,
		list: listSlice,
		wishlist: wishlistSlice,
		addWishlist: addWishlistSlice,
		removeWishlist: removeWishlistSlice,
		readingStatus: readingSlice,
		review: reviewSlice,
		readingDetail: readingDetailSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;