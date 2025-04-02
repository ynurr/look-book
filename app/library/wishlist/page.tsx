'use client'

import { useEffect, useState } from 'react';
import LeftMenu from '../LeftMenu';
import styles from './Wishlist.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteWishlist, fetchWishlist } from '@/store/slices/wishlistSlice';
import { useSession } from 'next-auth/react';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import DeleteModal from '@/app/components/DeleteModal';
import Image from 'next/image';

export default function Comment() {

    const { data: session } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
    const [isDelete, setIsDelete] = useState(false);

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
            const isbns = wishlist
                .filter((item) => selectedItems.includes(item.wish_id))
                .map((item) => item.isbn)
            
            await dispatch(deleteWishlist({
                user_id: session?.user.sub || '',
                book_isbn: isbns
            })).unwrap();
            
            setSelectAll(false);
            setCurrentPage(1);
            await dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 삭제에 실패했습니다.');
        }
    }

    const confirmRemove = () => {
        if (selectedItems.length === 0) {
            alert('위시리스트에서 삭제할 도서를 선택해주세요.');
            return;
        }
        setIsDelete(true);
    };

    const handleConfirmCancel = () => {
        setIsDelete(false);
    };

    const handleConfirmProceed = () => {
        setIsDelete(false);
        handleRemoveWishlist();
    };
    
    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 8;
    const pageCount = Math.ceil(wishlist.length / ItemsPerPage);
    const currentItems = wishlist.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
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
                    <button onClick={confirmRemove} className={styles.deleteBtn}>삭제</button>
                </div>
                <div className={styles.hrLine}></div>
                <div className={styles.list}>
                    {wishlist.length === 0 ?
                        <div className={styles.noData}>
                            <p>아직 위시리스트에 추가된 책이 없어요.</p>
                        </div>
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
                                <Link href={`/detail?id=${item.isbn}`}>
                                    <Image
                                        className={styles.cover}
                                        src={item.cover}
                                        alt={item.title}
                                        width={90}
                                        height={140}
                                        sizes="(max-width: 480px) 80px, 90px"
                                    />
                                </Link>
                                <div className={styles.info}>
                                    <Link href={`/detail?id=${item.isbn}`} className={styles.title}>
                                        {item.title}
                                    </Link>
                                    <p className={styles.author}>{item.author}</p>
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
            {isDelete && (
                <DeleteModal
                    message="선택된 도서를 위시리스트에서 삭제할까요?"
                    onCancel={handleConfirmCancel}
                    onConfirm={handleConfirmProceed}
                />
            )}
        </div>
    );
}
