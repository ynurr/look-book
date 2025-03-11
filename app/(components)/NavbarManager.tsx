'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Navbar2 from './Navbar2';
import NavbarLibrary from './NavbarLibrary';

export default function NavbarManager() {
  const pathname = usePathname();

  if (pathname.startsWith('/library')) {
    return <NavbarLibrary />;
  }

  return (
    <header>
      {pathname === '/home' ? <Navbar /> : <Navbar2 />}
    </header>
  );
}