import Link from 'next/link';
import styles from '../(styles)/List.module.css'

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
    return (
        <div className={styles.container}>
            <div className={styles.contents}>
                {items.map((item, index) => (
                    <div className={styles.item} key={item.isbn13}>
                        <Link href={`/detail?id=${item.isbn13}`}>
                            <img className={styles.cover} src={item.cover} alt={item.title}></img>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.author}>{item.author}</div>
                        </Link>
                        {/* <div className={styles.rating}>별점</div> */}
                    </div>
                ))}
            </div>
        </div>
    )
}