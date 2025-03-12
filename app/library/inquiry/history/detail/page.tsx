'use client'

import { redirect, useSearchParams } from "next/navigation";
import LeftMenu from "../../../LeftMenu";
import styles from './InquiryDetail.module.css';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchInquiryDetail } from "@/store/slices/inquirySlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export default function InquiryDetail() {
    
    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const param = useSearchParams();
    const inquiry_id = param.get('id');
    const inquiry = useSelector((state: RootState) => state.inquiry.inquiry);

    if (!session && status !== "loading") {
        redirect('/login');
    }

    useEffect(() => {
        if (inquiry_id) {
            dispatch(fetchInquiryDetail(inquiry_id))
        }
    }, [inquiry_id, dispatch])

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>1:1 문의내역</h2>
                <div className={styles.line}></div>
               
                <div className={styles.item}>
                    <span className={styles.inquiryTitle}>{inquiry.title}</span>
                    <span className={styles.inquiryDate}>{inquiry.created_at}</span>
                    <div className={styles.hrLine}></div>
                    <span className={styles.inquiryContent}>{inquiry.content}</span>
                    <div className={styles.hrLine}></div>
                    <span className={styles.reply}>관리자 답변</span>
                    {
                        inquiry.response ? (
                            <>
                                <span className={styles.replyContent}>{inquiry.response}</span>
                                <span className={styles.replyDate}>{inquiry.responded_at}</span>
                            </>
                        ) : (
                            <div className={styles.noData}>
                                <span>아직 답변이 등록되지 않았습니다.</span>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    );
}
