'use client'

import { useDispatch, useSelector } from "react-redux";
import List from "../(components)/List";
import { RootState, AppDispatch } from '@/store/store';
import { useEffect } from "react";
import { fetchBookList } from "@/store/slices/listSlice";
import styles from './New.module.css'

export default function New() {

    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.list.latestList);

    useEffect(() => {
        dispatch(fetchBookList({ type: 'ItemNewSpecial', max: '100', page: 'all' }));
    }, [])

    return (
        <div className={styles.container}>
            <h2>신규 도서</h2>
            <List items={books} />
        </div>
    )
}