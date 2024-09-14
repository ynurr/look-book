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
            <Link href="/">Home</Link>
            <Link href="/">Home</Link>
            <Link href="/">Home</Link>
            <Link href="/">Home</Link>
        </nav>
    )
}