'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {

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
        <nav className={`header-nav ${isScrolled ? 'scrolled' : ''}`}>
            <Link href="/">홈</Link>
            <Link href="/">카테고리</Link>
            <Link href="/">내 서재</Link>
            <Link href="/">로그인</Link>
        </nav>
    )
}