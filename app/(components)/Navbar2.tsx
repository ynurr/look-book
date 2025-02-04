'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './../(styles)/Navbar2.module.css'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar2() {

    const { data: session } = useSession();
    const [keyword, setKeyword] = useState<string>('');
    const router = useRouter();
    const currentPath = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); 
    };
    
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
                        <Link href="/" className={styles.homeLink}>LOOKBOOK</Link>
                        <ul className={styles.navList}>
                            <li>
                                <Link href="/popular" className={`${styles.navItem} ${currentPath === '/popular' ? styles.active : ''}`}>인기</Link> 
                            </li>
                            <li>
                                <Link href="/new" className={`${styles.navItem} ${currentPath === '/new' ? styles.active : ''}`}>신규</Link> 
                            </li>
                            <li>
                                <Link href="/library" className={`${styles.navItem} ${currentPath === '/library' ? styles.active : ''}`}>내서재</Link> 
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
                        <div className={styles.userIconWrapper} onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faUser} className={styles.iconUser} />
                            {isDropdownOpen && (
                                session ? (
                                    <div className={styles.dropdownMenu}>
                                        <Link href="/account/modify" className={styles.dropdownItem}>회원정보 수정</Link>
                                        <button 
                                            onClick={() => signOut({ callbackUrl: '/home' })} 
                                            className={styles.dropdownItem}>
                                            로그아웃
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.dropdownMenu}>
                                        <Link href="/login" className={styles.dropdownItem}>로그인</Link>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
