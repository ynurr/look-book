'use client'

import React, { useContext, useEffect } from 'react'
import styles from './Common.module.css'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchBookList, Books } from '@/store/slices/listSlice';
import { IoChevronForward } from "react-icons/io5";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from 'next/image';

interface BookItem {
    isbn13: string;
    title: string;
    author: string;
    cover: string;
}

export default function BestList() {

    const MenuItem: React.FC<{ book: BookItem }> = ({ book }) => {
        return (
            <div className={styles.item}>
                <Link href={`/detail?id=${book.isbn13}`} legacyBehavior>
                    <Image
                        className={styles.cover}
                        src={book.cover}
                        alt={book.title}
                        width={120}
                        height={180}
                    />
                </Link>
                <Link href={`/detail?id=${book.isbn13}`} className={styles.title} >{book.title}</Link>
                <p className={styles.author}>{book.author}</p>
            </div>
        )
    };
    
    type VisibilityType = React.ContextType<typeof VisibilityContext>;
    
    const LeftArrow: React.FC = () => {
        const visibility = useContext<VisibilityType>(VisibilityContext);
        const isFirstItemVisible = visibility.useIsVisible('first', true);
        return (
            <button
                disabled={isFirstItemVisible}
                onClick={() => visibility.scrollPrev()}
                className={styles.leftArrow}
            >
            <FaChevronLeft
                size={10}
                className={`${styles.leftBnt} ${isFirstItemVisible ? styles.disabledBtn : styles.activeBtn}`}
            />
            </button>
        );
    };
    
    const RightArrow: React.FC = () => {
        const visibility = useContext<VisibilityType>(VisibilityContext);
        const isLastItemVisible = visibility.useIsVisible('last', false);
        return (
            <button
                disabled={isLastItemVisible}
                onClick={() => visibility.scrollNext()}
                className={styles.rightArrow}
            >
            <FaChevronRight
                size={10}
                className={`${styles.rightBnt} ${isLastItemVisible ? styles.disabledBtn : styles.activeBtn}`}
            />
            </button>
        );
    };
    
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.list.bestList);

    useEffect(() => {
        dispatch(fetchBookList({ type: 'Bestseller', max: '24', page: '1' }));
    }, [dispatch]);

    return (
        <div>
            <Link 
                href="/popular" 
                className={styles.categoryLink}
            >많이 보고 있는 책<IoChevronForward />
            </Link>
            <div className={styles.scrollWrapper}>
                <ScrollMenu
                    scrollContainerClassName={styles.scrollContainer}
                    LeftArrow={LeftArrow}
                    RightArrow={RightArrow}
                >
                    {books.map((book: Books, index: number) => (
                        <MenuItem book={book} key={index} />
                    ))}
                </ScrollMenu>
            </div>
        </div>
    );
}