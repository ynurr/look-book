'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from './Navbar.module.css'
import { useSession } from "next-auth/react";
import { URLS } from '@/util/url';

export default function Navbar() {

    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 90) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    
    return (
        <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
            <Link href={URLS.popular}>인기</Link>
            <Link href={URLS.new}>신규</Link>
            {
                session?.user.id === "admin" ? 
                <Link href={URLS.admin.inquiry}>관리자</Link>
                :
                <Link href={URLS.library.libraryHome}>내 서재</Link>
            }
            {
                !session && <Link href={URLS.login}>로그인</Link>
            }
        </nav>
    )
}