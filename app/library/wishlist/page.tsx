'use client'

import { useState } from 'react';
import LeftMenu from '../LeftMenu';
import styles from './Wishlist.module.css'

export default function Comment() {

    const items = [
        { id: 1, cover: 'cover1', title: '책 제목 1', author: '작가 1' },
        { id: 2, cover: 'cover2', title: '책 제목 2', author: '작가 2' },
        { id: 3, cover: 'cover3', title: '책 제목 3', author: '작가 3' },
        { id: 4, cover: 'cover3', title: '책 제목 3', author: '작가 3' },
    ];

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
                <h2 className={styles.menuTitle}>위시리스트</h2>
                <div className={styles.line}></div>
               
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
                        <button className={styles.deleteBtn}>삭제</button>
                        <button className={styles.finishBtn}>다읽음</button>
                        <button className={styles.readingBtn}>읽는중</button>
                    </div>
                </div>
                <div className={styles.hrLine}></div>

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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
