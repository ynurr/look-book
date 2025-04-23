'use client'

import { useRouter, useSearchParams } from "next/navigation";
import LeftMenu from "../../../LeftMenu";
import styles from './InquiryDetail.module.css';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchInquiryDetail } from "@/store/slices/inquirySlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export default function InquiryDetail() {
    
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const param = useSearchParams();
    const inquiry_id = param.get('id');
    const inquiry = useSelector((state: RootState) => state.inquiry.inquiry);

    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/login');
            return;
        }
    }, [session, status, router])

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
                    <p className={styles.inquiryTitle}>{inquiry.title}</p>
                    <p className={styles.inquiryDate}>{inquiry.created_at}</p>
                    <div className={styles.hrLine}></div>
                    <p className={styles.inquiryContent}>{inquiry.content}</p>
                    <div className={styles.hrLine}></div>
                    <p className={styles.reply}>관리자 답변</p>
                    {
                        inquiry.response ? (
                            <>
                                <p className={styles.replyContent}>{inquiry.response}</p>
                                <p className={styles.replyDate}>{inquiry.responded_at}</p>
                            </>
                        ) : (
                            <div className={styles.noData}>
                                <p>아직 답변이 등록되지 않았습니다.</p>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    );
}
