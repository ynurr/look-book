'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './../(styles)/Navbar2.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Navbar2() {

    const [keyword, setKeyword] = useState<string>('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (keyword.trim()) {
            router.push(`/find?q=${encodeURIComponent(keyword.trim())}`)
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        <Link href="/" className={styles.homeLink}>LOOKBOOK</Link>
                        <ul className={styles.navList}>
                            <li>
                                <Link href="/popular">인기</Link>
                            </li>
                            <li>
                                <Link href="/new">신규</Link>
                            </li>
                            <li>
                                <Link href="/mylibrary">내서재</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.rightSection}>
                        <form onSubmit={handleSearch}>
                            <div className={styles.searchBox}>
                                <FontAwesomeIcon icon={faSearch} className={styles.iconSearch} />
                                <input 
                                    className={styles.search} 
                                    type="text" 
                                    value={keyword}
                                    onChange={(e: React. ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                />
                            </div>
                        </form>
                        <Link href="/my-info" className={styles.userIconLink}>
                            <FontAwesomeIcon icon={faUser} className={styles.iconUser}/>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
