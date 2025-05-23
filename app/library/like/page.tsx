'use client'

import { useSession } from "next-auth/react";
import LeftMenu from "../LeftMenu";
import styles from './Like.module.css';
import { PiStarFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Pagination from "@/app/components/Pagination";
import { deleteLike, fetchLikeAll } from "@/store/slices/likeSlice";
import DeleteModal from "@/app/components/DeleteModal";

export default function Like() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const likes = useSelector((state: RootState) => state.like.likeAll || []);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/login');
            return;
        }
    }, [session, status, router])

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchLikeAll({ user_id: session.user.sub }));
        }
    }, [session, dispatch])

    const handleCancelLike = async (review_id: string) => {
        try {
            if (session?.user.sub) {
                await dispatch(deleteLike({ user_id: session?.user.sub, review_id: review_id })).unwrap();
                await dispatch(fetchLikeAll({ user_id: session.user.sub }));
            }
        } catch (error) {
            alert('공감 해제 중 오류가 발생했습니다.')
        }
    }

    const confirmRemove = (review_id: string) => {
        setIsDelete(true);
        setSelectedId(review_id);
    };
    
    const handleConfirmCancel = () => {
        setIsDelete(false);
        setSelectedId(null);
    };
    
    const handleConfirmProceed = () => {
        if (selectedId) {
            handleCancelLike(selectedId);
        }
        setIsDelete(false);
        setSelectedId(null);
    };
    
    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 8;
    const pageCount = Math.ceil(likes.length / ItemsPerPage);
    const currentItems = likes.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>리뷰 공감 기록</h2>
                <div className={styles.line}></div>

                {likes.length === 0 ?
                    <div className={styles.noData}>
                        <p>마음에 드는 리뷰를 발견하면 공감 버튼을 눌러보세요.</p>
                    </div>
                    :
                    currentItems.map((item, i) => (
                        <div className={styles.list} key={i}>
                            <div className={styles.detail}>
                                <div className={styles.actions}>
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, index) => (
                                            <PiStarFill 
                                                key={index}
                                                className={index < item.rating ? styles.starFill : styles.star}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={() => confirmRemove(item._id)} className={styles.unlikeBtn}>
                                        공감 해제
                                    </button>
                                </div>
                                <p className={styles.title}>{item.book_title}</p>
                                <p className={styles.content}>{item.content}</p>
                            </div>
                            <div className={styles.hrLine}></div>
                        </div>
                    ))
                }
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>

            {isDelete && (
                <DeleteModal
                    message="선택된 리뷰의 공감을 해제할까요?"
                    onCancel={handleConfirmCancel} 
                    onConfirm={handleConfirmProceed}
                />
            )}
        </div>
    )
}