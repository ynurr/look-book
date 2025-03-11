'use client';

import Link from 'next/link';
import styles from './../(styles)/NavbarLibrary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { MdHome } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

export default function NavbarLibrary() {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const closeMenu = () => {
        setTimeout(() => setIsMenuOpen(false), 500);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <GiHamburgerMenu className={styles.icon} onClick={toggleMenu} />
                    <Link href="/" legacyBehavior>
                        <MdHome className={styles.icon} />
                    </Link>
                </div>
                <div className={styles.right}>
                    <div className={styles.userIconWrapper} onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faUser} className={styles.iconUser} />
                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link href="/account/modify" className={styles.dropdownItem} onClick={closeMenu}>비밀번호 변경</Link>
                                <button 
                                    onClick={() => { closeMenu(); signOut({ callbackUrl: '/home' }); }} 
                                    className={styles.dropdownItem}>
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className={styles.menu}>
                    <div className={styles.menuHeader}>
                        <span>메뉴</span>
                        <IoCloseSharp className={styles.closeIcon} onClick={toggleMenu} />
                    </div>
                    <nav className={styles.menuList}>
                        <span className={styles.menuTitle}>내 서재</span>
                        <Link href="/library" className={styles.menuItem} onClick={closeMenu}>내 서재</Link>
                        <Link href="/library/reading" className={styles.menuItem} onClick={closeMenu}>독서 현황</Link>
                        <Link href="/library/wishlist" className={styles.menuItem} onClick={closeMenu}>위시리스트</Link>
                        <div className={styles.hrLine}></div>
                        <span className={styles.menuTitle}>활동</span>
                        <Link href="/library/my-review" className={styles.menuItem} onClick={closeMenu}>나의 리뷰</Link>
                        <Link href="/library/comment" className={styles.menuItem} onClick={closeMenu}>댓글 알림</Link>
                        <Link href="/library/like" className={styles.menuItem} onClick={closeMenu}>리뷰 공감 기록</Link>
                        <div className={styles.hrLine}></div>
                        <span className={styles.menuTitle}>고객센터</span>
                        <Link href="/library/inquiry" className={styles.menuItem} onClick={closeMenu}>문의하기</Link>
                        <Link href="/library/inquiry/history" className={styles.menuItem} onClick={closeMenu}>1:1 문의내역</Link>
                    </nav>
                </div>
            )}
        </nav>
    );
}