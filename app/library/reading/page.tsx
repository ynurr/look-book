'use client'

import { useState } from 'react'
import LeftMenu from '../LeftMenu'
import styles from './Reading.module.css'

export default function Reading() {

    const items = [
        { id: 1, cover: 'cover1', title: '책 제목 1', author: '작가 1', isReview: 'Y' },
        { id: 2, cover: 'cover2', title: '책 제목 2', author: '작가 2', isReview: 'Y' },
        { id: 3, cover: 'cover3', title: '책 제목 3', author: '작가 3', isReview: 'N' },
        { id: 4, cover: 'cover3', title: '책 제목 3', author: '작가 3', isReview: 'N' },
    ];

    const [activeTab, setActiveTab] = useState(0)

    const handleTabClick = (tabName: number) => {
        setActiveTab(tabName)
    }

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);


    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([])
        } else {
            setSelectedItems(items.map(item => item.id))
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
                            {items.map((item) => (
                                <div className={styles.item} key={item.id}>
                                    <input 
                                        type='checkbox'
                                        checked={selectedItems.includes(item.id)}
                                        onChange={()=>{
                                            if (selectedItems.includes(item.id)) {
                                                setSelectedItems(selectedItems.filter(id => id !== item.id))
                                            } else {
                                                setSelectedItems([...selectedItems, item.id])
                                            }
                                        }}
                                    />
                                    <div className={styles.cover}>{item.cover}</div>
                                    <div className={styles.info}>
                                        <span className={styles.title}>{item.title}</span>
                                        <span className={styles.author}>{item.author}</span>
                                        {
                                            item.isReview === 'Y' ? (
                                                <span className={styles.star}>⭐⭐⭐⭐⭐</span>
                                            ) : (
                                                <span className={styles.reviewBtn}>리뷰쓰기</span>
                                            )
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                    <div className={`${styles.tabPane} ${activeTab === 1 ? styles.active : ''}`}>
                        <div className={styles.list}>
                            {items.map((item) => (
                                <div className={styles.item} key={item.id}>
                                    <input 
                                        type='checkbox'
                                        checked={selectedItems.includes(item.id)}
                                        onChange={()=>{
                                            if (selectedItems.includes(item.id)) {
                                                setSelectedItems(selectedItems.filter(id => id !== item.id))
                                            } else {
                                                setSelectedItems([...selectedItems, item.id])
                                            }
                                        }}
                                    />
                                    <div className={styles.cover}>{item.cover}</div>
                                    <div className={styles.info}>
                                        <span className={styles.title}>{item.title}</span>
                                        <span className={styles.author}>{item.author}</span>
                                        <span className={styles.isRead}>다 읽었나요?</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}