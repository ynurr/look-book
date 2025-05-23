"use client"

import { useState, useEffect } from "react";
import styles from "./AdminInquiryDetail.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DeleteModal from "@/app/components/DeleteModal";
import { URLS } from '@/util/url';

interface Inquiry {
    inquiry_id: string;
    title: string;
    content: string;
    date: string;
    status: "answered" | "pending";
    response?: string;
    responded_date: string;
}

export default function AdminInquiryDetail() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const param = useSearchParams();
    const id = param.get('id');
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [response, setResponse] = useState('');
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user.id !== "admin") {
            alert("접근 권한이 없습니다.");
            router.push('/home');
        }
    }, [session, status]);

    const fetchInquiry = async () => {
        try {
            const response = await fetch(`/api/db/admin/inquiry/detail?id=${id}`, {
                method: 'GET'
            })

            const data = await response.json();
            setInquiry(data);
        } catch (error) {
            console.error("문의 상세 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        if (status !== "authenticated" || session?.user.id !== "admin") {
            return;
        }
        fetchInquiry();
    }, [id]);

    const handleSubmit = async () => {
        if (!response.trim()) {
            alert("답변을 입력하세요.");
            return;
        }

        try {
            const result = await fetch("/api/db/admin/inquiry/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, response })
            });
            
            if (result.status !== 200) {
                throw new Error("답변 등록 실패");
            }

            alert("답변이 등록되었습니다.");
            setResponse('');
            fetchInquiry();
        } catch (error) {
            console.error("답변 등록 실패 "+error);
        }
    };

    const confirmRemove = () => {
        setIsDelete(true);
    };

    const handleConfirmCancel = () => {
        setIsDelete(false);
    };

    const handleConfirmProceed = async () => {
        try {
            const result = await fetch('/api/db/admin/inquiry/delete', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })

            if (result.status !== 200) {
                throw new Error("답변 삭제 실패");
            }

            alert("답변이 삭제되었습니다.");
            setIsDelete(false);
            fetchInquiry();
        } catch (error) {
            console.log("답변 삭제 실패 " + error);
        }
    }
        
    return (
        <div className={styles.container}>
            <Link href={URLS.admin.inquiry} className={styles.backBtn}>문의내역</Link>
            <h2>문의 상세</h2>
            <div className={styles.info}>
                <p className={styles.title}>{inquiry?.title}</p>
                <p className={styles.date}>{inquiry?.date}</p>
                <p className={inquiry?.status === "answered" ? styles.answered : styles.pending}>{inquiry?.status === "answered" ? "답변 완료" : "미답변"}</p>
                <div className={styles.hrLine}></div>
                <p className={styles.content}>{inquiry?.content}</p>
                <div className={styles.hrLine}></div>
                {
                    inquiry?.response ?
                    (
                        <>
                        <div className={styles.responseHeader}>
                            <span className={styles.responseLabel}>관리자 답변</span>
                            <button className={styles.deleteBtn} onClick={confirmRemove}>삭제</button>
                        </div>
                        <p className={styles.response}>{inquiry.response}</p>
                        <p className={styles.responseDate}>{inquiry.responded_date}</p>
                        </>
                    ) : (
                        <div className={styles.responseBox}>
                            <textarea
                                className={styles.textarea}
                                placeholder="답변을 입력하세요"
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                            />
                            <button className={styles.submitBtn} onClick={handleSubmit}>답변 등록하기</button>
                        </div>
                    )
                }
            </div>
            {isDelete && (
                <DeleteModal
                    message="등록된 답변을 삭제하시겠습니까?"
                    onCancel={handleConfirmCancel}
                    onConfirm={handleConfirmProceed}
                />
            )}
        </div>
    );
}
