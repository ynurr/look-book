'use client'

import { useEffect, useState } from 'react'
import LeftMenu from '../LeftMenu'
import styles from './Reading.module.css'
import { PiStarFill } from "react-icons/pi";
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReadingStatus } from '@/store/slices/readingSlice';
import Link from 'next/link';
import Pagination from '@/app/(components)/Pagination';

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
        setActiveTab(tabName);
        setCurrentPage(1);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 6;
    const filteredBooks = books.filter(item => item.status === (activeTab === 0 ? '1' : '0'));
    const pageCount = Math.ceil(filteredBooks.length / ItemsPerPage);
    const currentItems = filteredBooks.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
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

                        {/* <li>
                            <input className={styles.input} placeholder='나의 도서 검색'></input>
                        </li> */}

                    </ul>
                </div>
                <div className={styles.content}>
                    {activeTab === 0 && (
                        <div className={styles.list}>
                            {filteredBooks.length === 0 ?
                                <div className={styles.noData}>
                                    <span>아직 다 읽은 책이 없습니다.<br />도서의 상세 페이지에서 [독서 완료]를 클릭해 추가해보세요!</span>
                                </div>
                                :
                                currentItems
                                    .filter(item => item.status === '1') // 다 읽은 책
                                    .map((item) => (
                                        <Link
                                            key={item.isbn}
                                            href={`/library/reading/detail?isbn=${item.isbn}`} legacyBehavior>
                                            <div className={styles.item}>
                                                <img className={styles.cover} src={item.cover} alt={item.title} />
                                                
                                                <div className={styles.info}>
                                                    <span className={styles.title}>{item.title}</span>
                                                    <span className={styles.author}>{item.author}</span>
                                                    {
                                                        item.rating > 0 &&
                                                            <span className={styles.star}>
                                                                {[...Array(5)].map((_, index) => (
                                                                    <PiStarFill 
                                                                        key={index}
                                                                        className={index < item.rating ? styles.starFill : styles.star}
                                                                    />
                                                                ))}
                                                            </span>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                            }
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className={styles.list}>
                            {filteredBooks.length === 0 ?
                                <div className={styles.noData}>
                                    <span>현재 읽고 있는 책이 없습니다.<br />도서의 상세 페이지에서 [독서 중]을 클릭해 추가해보세요!</span>
                                </div>
                                :
                                currentItems
                                    .filter(item => item.status === '0') // 읽고 있는 책
                                    .map((item) => (
                                        <Link 
                                            key={item.isbn}
                                            href={`/library/reading/detail?isbn=${item.isbn}`} legacyBehavior>
                                            <div className={styles.item}>
                                                <img className={styles.cover} src={item.cover} alt={item.title} />
                                                <div className={styles.info}>
                                                    <span className={styles.title}>{item.title}</span>
                                                    <span className={styles.author}>{item.author}</span>
                                                    {
                                                        item.rating > 0 &&
                                                            <span className={styles.star}>
                                                                {[...Array(5)].map((_, index) => (
                                                                    <PiStarFill 
                                                                        key={index}
                                                                        className={index < item.rating ? styles.starFill : styles.star}
                                                                    />
                                                                ))}
                                                            </span>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                ))
                            }
                        </div>
                    )}
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    )
}