'use client'

import { useState } from "react";
import LeftMenu from "../LeftMenu";
import styles from './Inquiry.module.css'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addInquiry } from "@/store/slices/inquirySlice";
import { useSession } from "next-auth/react";

export default function Inquiry() {

    const { data:session } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        if (!title) {
            alert('문의 제목을 작성해주세요.');
            return;
        }

        if (!content) {
            alert('문의 내용을 작성해주세요.');
            return;
        }

        try {
            await dispatch(addInquiry({
                user_id: session?.user.sub || '',
                title,
                content,
            })).unwrap();
            
            window.location.href = '/library/inquiry/history';
        } catch (error) {
            alert('문의글 작성 중 오류가 발생했습니다.');
        }
    }
    
    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>문의하기</h2>
                <div className={styles.line}></div>
                <div className={styles.formGroup}>
                    <label>제목</label>
                    <input 
                        className={styles.title}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}>
                    </input>
                </div>
                <div className={styles.formGroup}>
                    <label>내용</label>
                    <textarea 
                        className={styles.content} 
                        maxLength={500} 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}>
                    </textarea>
                </div>

                <div className={styles.btnBox}>
                    <button className={styles.btn} onClick={handleSubmit}>등록</button>
                </div>
            </div>
        </div>
    )
}