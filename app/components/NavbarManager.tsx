'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Navbar2 from './Navbar2';
import NavbarLibrary from '../library/NavbarLibrary';

export default function NavbarManager() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    if ((pathname.startsWith('/library') || 
         pathname.startsWith('/account') || 
         pathname.startsWith('/profile') || 
         pathname.startsWith('/write'))  
        &&  isMobile) {
        return <NavbarLibrary />;
    }

    return (
        <header>
            {pathname === '/home' ? <Navbar /> : <Navbar2 />}
        </header>
    );
}
