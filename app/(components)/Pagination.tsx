import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from './Pagination.module.css'

interface PaginationProps {
    pageCount: number; // 총 페이지 수
    onPageChange: (selected: { selected: number }) => void; // 페이지 변경 핸들러
    currentPage: number; // 현재 페이지 번호
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange, currentPage }) => {
    return (
        <ReactPaginate
            previousLabel={<span className={`${styles.paginationLink} ${currentPage === 1 ? styles.disabled : ''}`}><FiChevronLeft /></span>}
            nextLabel={<span className={`${styles.paginationLink} ${currentPage === pageCount ? styles.disabled : ''}`}><FiChevronRight /></span>}
            pageCount={pageCount}
            onPageChange={onPageChange}
            containerClassName={styles.pagination}
            pageLinkClassName={styles.paginationLink}
            activeLinkClassName={styles.paginationLinkActive}
        />
    );
};

export default Pagination;