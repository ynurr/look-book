'use client'

import Link from 'next/link'
import styles from './LeftMenu.module.css'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
    bookCount: number;
    reviewCount: number;
    lastRead: string;
}

export default function LeftMenu() {
    
    const { data: session, status } = useSession();

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const [user, setUser] = useState<User>({
        bookCount: 0,
        reviewCount: 0,
        lastRead: '-'
    })

    useEffect(() => {
        if (status === 'authenticated' && session?.user.sub) {
            const fetchUserInfo = async() => {
                try {
                    const response = await fetch('/api/db/user/stat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ sub: session?.user.sub })
                    })
                    
                    const result = await response.json()

                    if (response.status === 200) {
                        setUser(result)
                    } else {
                        alert(result.message)
                    }
                } catch (error) {
                    console.error("사용자 조회 실패", error);
                }
            }

            fetchUserInfo()
        }
    }, [session, status])

    return (
        <div className={styles.container}>
            <div className={styles.userInfo}>
                <span className={styles.nickname}>{session?.user.nickname} 님</span>
                <span className={styles.stat}>리뷰 작성 <span className={styles.redText}>{user.reviewCount}권</span></span>
                <span className={styles.stat}>지금까지 읽은 책 <span className={styles.redText}>{user.bookCount}권</span></span> 
                <span className={styles.stat}>마지막 독서 <span className={styles.redText}>
                        {user.reviewCount === 0 && user.bookCount === 0 ? '-일 전' :
                        user.lastRead == '0' ? '오늘' : user.lastRead+'일 전'}</span>
                </span> 
            </div>
            <div className={styles.menu}>
                <span className={styles.menuTitle}>내 서재</span>
                <Link href="/library" className={styles.menuItem}>홈</Link>
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