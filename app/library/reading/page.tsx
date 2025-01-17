'use client'

import { useEffect, useState } from 'react'
import LeftMenu from '../LeftMenu'
import styles from './Reading.module.css'
import { PiStarFill } from "react-icons/pi";
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReadingStatus, fetchRemoveBook, fetchUpdateStatus } from '@/store/slices/readingSlice';
import Link from 'next/link';

export default function Reading() {

    const { data: session, status } = useSession();

    const books = useSelector((state: RootState) => state.readingStatus.books || []);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchReadingStatus(session?.user.sub || ''))
        }
    }, [session, dispatch])

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (tabName: number) => {
        setActiveTab(tabName)
    }

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([])
        } else {
            setSelectedItems(books.map(item => item.isbn))
        }
        setSelectAll(!selectAll)
    }

    const handleUpdateStatus = async (status: string) => {
        try {
            const selectedBooks = books.filter((item) => selectedItems.includes(item.isbn));
    
            const isbns = selectedBooks.map((item) => item.isbn);
            const titles = selectedBooks.map((item) => item.title);
            const covers = selectedBooks.map((item) => item.cover);
            const authors = selectedBooks.map((item) => item.author);
            
            const result = await dispatch(
                fetchUpdateStatus({
                    user_id: session?.user.sub || '',
                    book_isbn: isbns,
                    book_title: titles,
                    book_cover: covers,
                    book_author: authors,
                    status: status,
                })
            ).unwrap();
            
            alert(result.message);
            setSelectAll(false);
            setSelectedItems([]);
            // setCurrentPage(1);
            dispatch(fetchReadingStatus(session?.user.sub || ''));
        } catch (error) {
            alert('독서 상태 변경 실패');
        }
    }

    const handleRemoveBook = async () => {
        try {
            const isbns = books.filter((item) => selectedItems.includes(item.isbn)).map((item) => item.isbn);

            const result = await dispatch(fetchRemoveBook({
                    user_id: session?.user.sub || '',
                    book_isbn: isbns
                })
            ).unwrap();

            alert(result.message);
            setSelectAll(false);
            // setCurrentPage(1);
            dispatch(fetchReadingStatus(session?.user.sub || ''));
        } catch (error) {
            alert('독서현황 삭제 실패');
        }
    }

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>독서현황</h2>
                <div className={styles.tab}>
                    <ul className={styles.navTab}>
                        <li className={`${styles.navItem} ${activeTab === 0 ? styles.active : ''}`}
                            onClick={() => handleTabClick(0)}
                        >
                            <a className={`${styles.navLink} ${activeTab === 0 ? styles.active : ''}`}>다 읽은 책</a>
                        </li>
                        <li
                            className={`${styles.navItem} ${activeTab === 1 ? styles.active : ''}`}
                            onClick={() => handleTabClick(1)}
                        >
                            <a className={`${styles.navLink} ${activeTab === 1 ? styles.active : ''}`}>읽고 있는 책</a>
                        </li>

                        <li>
                            <input className={styles.input} placeholder='나의 도서 검색'></input>
                        </li>

                    </ul>
                </div>

                <div className={styles.content}>
                    <div className={styles.topBox}>
                        <div className={styles.selectAll}>
                            <input 
                                type='checkbox'
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <span>전체 선택</span>
                        </div>
                        <div className={styles.btnBox}>
                            {activeTab === 0 && <button onClick={() => handleUpdateStatus('0')} className={styles.readingBtn}>읽고 있어요</button>}
                            {activeTab === 1 && <button onClick={() => handleUpdateStatus('1')} className={styles.finishBtn}>다 읽었어요</button>}
                            <button onClick={handleRemoveBook} className={styles.deleteBtn}>삭제</button>
                        </div>
                    </div>
                    <div className={styles.hrLine}></div>
                    {activeTab === 0 && (
                        <div className={styles.list}>
                            {books
                                .filter(item => item.status === '1') // 다 읽은 책
                                .map((item) => (
                                    <div className={styles.item} key={item.isbn}>
                                        <input 
                                            type='checkbox'
                                            checked={selectedItems.includes(item.isbn)}
                                            onChange={()=>{
                                                if (selectedItems.includes(item.isbn)) {
                                                    setSelectedItems(selectedItems.filter(isbn => isbn !== item.isbn))
                                                } else {
                                                    setSelectedItems([...selectedItems, item.isbn])
                                                }
                                            }}
                                        />
                                        <Link href={`/detail?id=${item.isbn}`}>
                                            <img className={styles.cover} src={item.cover} alt={item.title} />
                                        </Link>
                                        <div className={styles.info}>
                                            <Link href={`/detail?id=${item.isbn}`}>
                                                <span className={styles.title}>{item.title}</span>
                                            </Link>
                                            <span className={styles.author}>{item.author}</span>
                                            {
                                                item.rating > 0 ? (
                                                    <span className={styles.star}>
                                                        {[...Array(5)].map((_, index) => (
                                                            <PiStarFill 
                                                                key={index}
                                                                className={index < item.rating ? styles.starFill : styles.star}
                                                            />
                                                        ))}
                                                    </span>
                                                ) : (
                                                    <span className={styles.reviewBtn}>리뷰쓰기</span>
                                                )
                                            }
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className={styles.list}>
                            {books
                                .filter(item => item.status === '0') // 읽고 있는 책
                                .map((item) => (
                                    <div className={styles.item} key={item.isbn}>
                                        <input 
                                            type='checkbox'
                                            checked={selectedItems.includes(item.isbn)}
                                            onChange={()=>{
                                                if (selectedItems.includes(item.isbn)) {
                                                    setSelectedItems(selectedItems.filter(isbn => isbn !== item.isbn))
                                                } else {
                                                    setSelectedItems([...selectedItems, item.isbn])
                                                }
                                            }}
                                        />
                                        <Link href={`/detail?id=${item.isbn}`}>
                                            <img className={styles.cover} src={item.cover} alt={item.title} />
                                        </Link>
                                        <div className={styles.info}>
                                            <Link href={`/detail?id=${item.isbn}`}>
                                                <span className={styles.title}>{item.title}</span>
                                            </Link>
                                            <span className={styles.author}>{item.author}</span>
                                            {
                                                item.rating > 0 ? (
                                                    <span className={styles.star}>
                                                        {[...Array(5)].map((_, index) => (
                                                            <PiStarFill 
                                                                key={index}
                                                                className={index < item.rating ? styles.starFill : styles.star}
                                                            />
                                                        ))}
                                                    </span>
                                                ) : (
                                                    <span className={styles.isRead}>다 읽었나요?</span>
                                                )
                                            }
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}