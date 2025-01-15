'use client'

import { useEffect, useState } from 'react'
import LeftMenu from '../LeftMenu'
import styles from './Reading.module.css'
import { PiStarFill } from "react-icons/pi";
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReadingStatus } from '@/store/slices/readingSlice';

export default function Reading() {

    const { data: session, status } = useSession();

    const books = useSelector((state: RootState) => state.readingStatus.books);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchReadingStatus(session?.user.sub || ''))
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
                            {activeTab === 1 && <button className={styles.finishBtn}>다 읽었어요</button>}
                            <button className={styles.deleteBtn}>삭제</button>
                        </div>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div className={`${styles.tabPane} ${activeTab === 0 ? styles.active : ''}`}>
                        
                        <div className={styles.list}>
                            {activeTab === 0
                                ? books
                                    .filter(item => item.status === '1' || item.status === '2') // 다 읽은 책
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
                                        <img className={styles.cover} src={item.cover} alt={item.title} />
                                        <div className={styles.info}>
                                            <span className={styles.title}>{item.title}</span>
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
                                ))
                            : books
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
                                        <img className={styles.cover} src={item.cover} alt={item.title} />
                                        <div className={styles.info}>
                                            <span className={styles.title}>{item.title}</span>
                                            <span className={styles.author}>{item.author}</span>
                                            <span className={styles.isRead}>다 읽었나요?</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}