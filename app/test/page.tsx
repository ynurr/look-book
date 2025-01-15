'use client'
import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import styles from './Test.module.css';

interface MenuItemProps {
    item: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
    return <div className={styles.item}>{item}</div>;
};

export default function Scroll() {
    const items: string[] = Array.from({ length: 10 }, (_, index) => `Item ${index + 1}`);

    return (
        <div>
            <h1>수평 스크롤</h1>
            <ScrollMenu
                scrollContainerClassName={styles.scrollContainer} // 스크롤 컨테이너 스타일 추가
            >
                {items.map((item, index) => (
                    <MenuItem key={index} item={item} />
                ))}
            </ScrollMenu>
        </div>
    );
}
