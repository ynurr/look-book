'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from './../(styles)/Navbar.module.css'
import { useSession } from "next-auth/react";

export default function Navbar() {

    const { data: session } = useSession();

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 90) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    
    return (
        <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
            <Link href="/home">홈</Link>
            <Link href="/popular">카테고리</Link>
            <Link href="/library">내 서재</Link>
            {session ? (
                <Link href="/account/modify">프로필</Link>
            ) : (
                <Link href="/login">로그인</Link>
            )}
        </nav>
    )
}