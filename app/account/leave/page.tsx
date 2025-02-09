'use client'

import { useEffect, useState } from 'react'
import styles from './AccountLeave.module.css'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Leave() {

    const { data: session } = useSession();
    const [isAgree, setIsAgree] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const reason = [
        "더이상 책을 읽지 않아서",
        "사이트 이용 불편",
        "개인정보 및 보안 우려",
        "회원 혜택 부족",
        "원하는 책이 없어서",
        "다른 사이트가 더 좋아서",
        "기타"
    ];
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const handleReasonChange = (reason: string) => {
        setSelectedReasons((prev) => 
            prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason] 
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAgree) {
            setError('유의사항을 확인하고 동의해주세요.');
            return;
        }

        if (selectedReasons.length === 0) {
            alert("탈퇴 사유를 선택해주세요.");
            return;
        }

        try {
            const response = await fetch('/api/db/account/leave', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sub: session?.user.sub, reason: selectedReasons })
            })

            const result = await response.json();

            if (response.status === 200) {
                alert('회원 탈퇴 되었습니다.');
                signOut({ callbackUrl: '/home' });
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("오류가 발생했습니다.");
            console.error(error);
        }
    }

    const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgree(e.target.checked);
        if (e.target.checked) {
            setError(''); 
        }
    };

    return (
        <div className={styles.container}>
            <h2>회원탈퇴</h2>
            <div className={styles.warning}>
                <span className={styles.warningInfo}>
                    지금 탈퇴하면 <span className={styles.redText}>모든 리뷰가 사라져요.</span> 😥
                </span>
                <span className={styles.warningMsg}>정말 탈퇴하실 건가요? 탈퇴하시는 이유를 알려주세요.</span>
            </div>
            <div className={styles.reasonWrapper}>
                <form className={styles.reasonForm}>
                    {reason.map((reason, index) => (
                        <label key={index}>
                            <input 
                                type="checkbox" 
                                checked={selectedReasons.includes(reason)}
                                onChange={() => handleReasonChange(reason)}
                            /> {reason}
                        </label>
                    ))}
                </form>
            </div>
            {/* <div className={styles.reasonWrapper}>
                <form className={styles.reasonForm}>
                    <label>
                        <input type="checkbox"/> 더이상 책을 읽지 않아서
                    </label>
                    <label>
                        <input type="checkbox"/> 사이트 이용 불편
                    </label>
                    <label>
                        <input type="checkbox"/> 개인정보 및 보안 우려
                    </label>
                    <label>
                        <input type="checkbox"/> 회원 혜택 부족
                    </label>
                    <label>
                        <input type="checkbox"/> 원하는 책이 없어서
                    </label>
                    <label>
                        <input type="checkbox"/> 다른 사이트가 더 좋아서
                    </label>
                    <label>
                        <input type="checkbox"/> 기타
                    </label>
                </form>
            </div> */}
            <div className={styles.notice}>
                <span className={styles.noticeTitle}>회원탈퇴 유의사항</span>
                <ul className={styles.noticeList}>
                    <li>· 탈퇴 시, 사용한 계정 정보가 삭제되며 복구할 수 없습니다.</li>
                    <li>· 작성한 리뷰를 포함하여 모든 데이터가 삭제됩니다.</li>
                </ul>
            </div>
            <div className={styles.agreeWrapper}>
                <div className={styles.checkboxWrapper}>
                    <input type="checkbox" onChange={handleAgreeChange}/>
                    <span className={styles.agreeMsg}>위 내용을 모두 확인했으며, 동의합니다.</span>
                </div>
                <p className={styles.errorMsg}>{error}</p>
            </div>
            <div className={styles.btnWrapper}>
                <button 
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                >회원탈퇴</button>
                <Link href={'/home'}>
                    <button className={styles.cancelBtn}>돌아가기</button>
                </Link>
            </div>
        </div>
    )
}