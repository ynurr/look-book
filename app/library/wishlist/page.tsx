'use client'

import { useEffect, useState } from 'react';
import LeftMenu from '../LeftMenu';
import styles from './Wishlist.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchWishlist } from '@/store/slices/wishlistSlice';
import { useSession } from 'next-auth/react';
import { fetchRemoveWishlist } from '@/store/slices/RemoveWishlistSlice';
import Pagination from '@/app/(components)/Pagination';

export default function Comment() {

    const { data: session } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist(session?.user.sub || ''))
    }, [session, dispatch])

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([])
        } else {
            setSelectedItems(currentItems.map(item => item.wish_id))
        }
        setSelectAll(!selectAll)
    }

    const handleRemoveWishlist = async () => {
        try {
            const isbns = wishlist.filter((item) => selectedItems.includes(item.wish_id))
            .map((item) => item.isbn)
            
            const result = await dispatch(
                fetchRemoveWishlist({
                    user_id: session?.user.sub || '',
                    book_isbn: isbns
                })
            ).unwrap();
            
            alert(result.message);
            setSelectAll(false);
            setCurrentPage(1);
            dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 삭제 실패');
        }
    }

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 8;
    const pageCount = Math.ceil(wishlist.length / ItemsPerPage);
    const currentItems = wishlist.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

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
                        <button onClick={handleRemoveWishlist} className={styles.deleteBtn}>삭제</button>
                        <button className={styles.finishBtn}>다읽음</button>
                        <button className={styles.readingBtn}>읽는중</button>
                    </div>
                </div>
                <div className={styles.hrLine}></div>

                <div className={styles.list}>
                    {wishlist.length === 0 ?
                        <p className={styles.noData}>아직 위시리스트를 추가하지 않으셨어요.</p>
                        :
                        currentItems.map((item) => (
                            <div className={styles.item} key={item.wish_id}>
                                <input 
                                    type='checkbox'
                                    checked={selectedItems.includes(item.wish_id)}
                                    onChange={()=>{
                                        if (selectedItems.includes(item.wish_id)) {
                                            setSelectedItems(selectedItems.filter(wish_id => wish_id !== item.wish_id))
                                        } else {
                                            setSelectedItems([...selectedItems, item.wish_id])
                                        }
                                    }}
                                />
                                <img className={styles.cover} src={item.cover} alt={item.title} />
                                <div className={styles.info}>
                                    <span className={styles.title}>{item.title}</span>
                                    <span className={styles.author}>{item.author}</span>
                                </div>
                            </div>
                        ))
                    }
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
}
