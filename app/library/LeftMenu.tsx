'use client'

import Link from 'next/link'
import styles from './LeftMenu.module.css'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { fetchUserStat } from '@/store/slices/statSlice';

export default function LeftMenu() {
    
    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const goal = useSelector((state: RootState) => state.stat.goal);
    const bookCount = useSelector((state: RootState) => state.stat.bookCount);
    
    if (!session && status !== "loading") {
        redirect('/login');
    }
    
    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            try {
                dispatch(fetchUserStat({ user_id: session.user.sub }))
            } catch (error) {
                alert('회원 정보 조회 중 오류가 발생했습니다.');
            }
        }
    }, [session, dispatch])

    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <span className={styles.nickname}>{session?.user.nickname} 님</span>
                <div className={styles.goalBox}>
                    <span>🎯 독서 목표 : {goal}권</span>
                    <progress value={bookCount} max={goal} className={styles.progressBar}></progress> 
                </div>
                <Link href="/profile/edit" className={styles.editBtn}>
                    프로필 수정
                </Link>
            </div>
            <div className={styles.menu}>
                <span className={styles.menuTitle}>내 서재</span>
                <Link href="/library" className={styles.menuItem}>내 서재</Link>
                <Link href="/library/reading" className={styles.menuItem}>독서 현황</Link>
                <Link href="/library/wishlist" className={styles.menuItem}>위시리스트</Link>
                <span className={styles.menuTitle}>활동</span>
                <Link href="/library/my-review" className={styles.menuItem}>나의 리뷰</Link>
                <Link href="/library/comment" className={styles.menuItem}>댓글 알림</Link>
                <Link href="/library/like" className={styles.menuItem}>리뷰 공감 기록</Link>
                <span className={styles.menuTitle}>고객센터</span>
                <Link href="/library/inquiry" className={styles.menuItem}>문의하기</Link>
                <Link href="/library/inquiry/history" className={styles.menuItem}>1:1 문의내역</Link>
            </div>
        </div>
    )
}