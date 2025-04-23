'use client'

import Link from 'next/link'
import styles from './LeftMenu.module.css'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { fetchUserStat } from '@/store/slices/statSlice';
import { URLS } from '@/util/url';

export default function LeftMenu() {
    
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const goal = useSelector((state: RootState) => state.stat.goal);
    const bookCount = useSelector((state: RootState) => state.stat.bookCount);
    const nickname = useSelector((state: RootState) => state.stat.nickname);
    
    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/login');
            return;
        }
    }, [session, status, router])
    
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
                <span className={styles.nickname}>{nickname} 님</span>
                <div className={styles.goalBox}>
                    <span>🎯 독서 목표 : {goal}권</span>
                    <progress value={bookCount} max={goal} className={styles.progressBar}></progress> 
                </div>
                <Link href={URLS.profile.edit} className={styles.editBtn}>
                    프로필 수정
                </Link>
            </div>
            <div className={styles.menu}>
                <span className={styles.menuTitle}>내 서재</span>
                <Link href={URLS.library.libraryHome} className={styles.menuItem}>내 서재</Link>
                <Link href={URLS.library.reading} className={styles.menuItem}>독서 현황</Link>
                <Link href={URLS.library.wishlist} className={styles.menuItem}>위시리스트</Link>
                <span className={styles.menuTitle}>활동</span>
                <Link href={URLS.library.myReview} className={styles.menuItem}>나의 리뷰</Link>
                <Link href={URLS.library.comment} className={styles.menuItem}>댓글 알림</Link>
                <Link href={URLS.library.like} className={styles.menuItem}>리뷰 공감 기록</Link>
                <span className={styles.menuTitle}>고객센터</span>
                <Link href={URLS.library.inquiry} className={styles.menuItem}>문의하기</Link>
                <Link href={URLS.library.inquiryHistory} className={styles.menuItem}>1:1 문의내역</Link>
                <span className={styles.menuTitle}>계정</span>
                <Link href={URLS.account.modify} className={styles.menuItem}>비밀번호 변경</Link>
                <Link href={URLS.account.leave} className={styles.menuItem}>회원탈퇴</Link>
            </div>
        </div>
    )
}