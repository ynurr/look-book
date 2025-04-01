import Link from 'next/link';
import styles from './List.module.css'
import { useState } from 'react';
import Pagination from './Pagination';

interface Book {
    cover: string;
    title: string;
    author: string;
    isbn13: string;
}

interface ListProps {
    items: Book[];
}

export default function List({items}: ListProps) {

    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 24; 
    const pageCount = Math.ceil(items.length / ItemsPerPage);
    const currentItems = items.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const isIOS = () => {
        return typeof window !== 'undefined' && /iP(hone|ad)/.test(navigator.userAgent);
    };

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (isIOS()) { // iOS 대응
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }, 300)
            }
        }, 0)
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.contents}>
                {currentItems.map((item, index) => (
                    <div className={styles.item} key={index}>
                        <Link href={`/detail?id=${item.isbn13}`}>
                            <img className={styles.cover} src={item.cover} alt={item.title}></img>
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.author}>{item.author}</p>
                        </Link>
                    </div>
                ))}
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}