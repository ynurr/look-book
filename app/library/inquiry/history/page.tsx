'use client'

import Link from "next/link";
import LeftMenu from "../../LeftMenu";
import styles from './InquiryHistory.module.css';
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchInquiryAll } from "@/store/slices/inquirySlice";
import { redirect } from "next/navigation";
import Pagination from "@/app/components/Pagination";

export default function Inquiry() {
    
    const { data: session, status } = useSession();

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const dispatch = useDispatch<AppDispatch>();
    const inquiries = useSelector((state: RootState) => state.inquiry.inquiries || []);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchInquiryAll({ user_id: session.user.sub }))
        }
    }, [session, dispatch])
    
    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 8;
    const pageCount = Math.ceil(inquiries.length / ItemsPerPage);
    const currentItems = inquiries.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>1:1 문의내역</h2>
                <div className={styles.line}></div>
                {inquiries.length === 0 ?
                    <div className={styles.noData}>
                        <p>문의내역이 존재하지 않습니다.</p>
                    </div>
                    :
                    currentItems.map((item) => (
                        <div key={item.inquiry_id} className={styles.list}>
                            <div className={styles.item}>
                                <Link href={`/library/inquiry/history/detail?id=${item.inquiry_id}`} className={styles.title}>
                                    {item.title}
                                </Link>
                                <p className={styles.date}>{item.created_at}</p>
                            </div>
                            <span
                                className={
                                    item.status === "답변완료"
                                        ? styles.statusComplete
                                        : styles.statusPending
                                }
                            >
                                {item.status}
                            </span>
                        </div>
                    ))
                }
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}
