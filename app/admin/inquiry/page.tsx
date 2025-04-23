"use client"

import {useState, useEffect} from "react";
import Link from "next/link";
import styles from "./AdminInquiry.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Inquiry {
    inquiry_id: string;
    title: string;
    date: string;
    status: "answered" | "pending"; // 답변 완료, 미답변
}

export default function AdminInquiry() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [filter, setFilter] = useState < "all" | "answered" | "pending" > ("all");

    useEffect(() => {
        if (status === "authenticated" && session?.user.id !== "admin") {
            alert("접근 권한이 없습니다.");
            router.push('/home');
        }
    }, [session, status]);

    useEffect(() => {
        if (status !== "authenticated" || session?.user.id !== "admin") {
            return;
        }
        const fetchInquiries = async () => {
            try {
                const response = await fetch("/api/db/admin/inquiry",{
                    method: 'GET'
                });
                const data = await response.json();
                setInquiries(data);
            } catch (error) {
                console.log("문의 목록 불러오기 실패:", error);
            }
        };

        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter(
        (inquiry) => filter === "all" || inquiry.status === filter
    );

    return (
        <div className={styles.container}>
            <h2>문의내역 관리</h2>

            <div className={styles.filter}>
                <label>답변 상태 : </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                    <option value="all">전체</option>
                    <option value="answered">답변 완료</option>
                    <option value="pending">미답변</option>
                </select>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>문의 제목</th>
                        <th>문의 날짜</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredInquiries.length > 0
                            ? (filteredInquiries.map((inquiry) => (
                                <tr key={inquiry.inquiry_id}>
                                    <td>
                                        <Link href={`/admin/inquiry/detail?id=${inquiry.inquiry_id}`} className={styles.link}>
                                            {inquiry.title}
                                        </Link>
                                    </td>
                                    <td>{inquiry.date}</td>
                                    <td
                                        className={inquiry.status === "answered" ? styles.answered : styles.pending}>
                                        {
                                            inquiry.status === "answered" ? "답변완료" : "미답변"
                                        }
                                    </td>
                                </tr>
                            )))
                            : (
                                <tr>
                                        <td colSpan={3}>
                                            <div className={styles.noData}>문의 내역이 없습니다.</div>
                                        </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </div>
    );
}
