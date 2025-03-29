'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './Navbar2.module.css'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar2() {

    const { data: session } = useSession();
    const [keyword, setKeyword] = useState<string>('');
    const router = useRouter();
    const currentPath = usePathname();
    
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        <Link href="/" className={styles.homeLink}>LOOK<br/>BOOK</Link>
                        <ul className={styles.navList}>
                            <li>
                                <Link href="/popular" className={`${styles.navItem} ${currentPath === '/popular' ? styles.active : ''}`}>인기</Link> 
                            </li>
                            <li>
                                <Link href="/new" className={`${styles.navItem} ${currentPath === '/new' ? styles.active : ''}`}>신규</Link> 
                            </li>
                            <li>
                               {
                                    session?.user.id === "admin" ? 
                                    <Link href="/admin/inquiry" className={`${styles.navItem} ${currentPath === '/admin/inquiry' ? styles.active : ''}`}>관리자</Link>
                                    :
                                    <Link href="/library" className={`${styles.navItem} ${currentPath === '/library' ? styles.active : ''}`}>내 서재</Link> 
                                }
                            </li>
                        </ul>
                    </div>
                    <div className={styles.rightSection}>
                        <form onSubmit={handleSearch} className={styles.searchDesktop}>
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
                        {session ? 
                            (
                                <button 
                                    onClick={() => signOut({ callbackUrl: '/home' })} 
                                    className={styles.btn}>
                                    로그아웃
                                </button>
                            ) : (
                                <Link href="/login" className={styles.btn}>로그인</Link>
                            )
                        }
                    </div>
                </div>

                <form onSubmit={handleSearch} className={styles.searchMobile}>
                    <div className={styles.searchBox}>
                        <FontAwesomeIcon icon={faSearch} className={styles.iconSearch} />
                        <input 
                            className={styles.search} 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </form>
                
            </div>
        </nav>
    )
}
