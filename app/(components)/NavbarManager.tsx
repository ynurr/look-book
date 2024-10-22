'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Navbar2 from './Navbar2';

export default function NavbarManager() {
  const pathname = usePathname();

  return (
    <header>
      {pathname === '/home' ? <Navbar /> : <Navbar2 />}
    </header>
  );
}