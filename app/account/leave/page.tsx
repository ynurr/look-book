'use client'

import { useState } from 'react'
import styles from './AccountLeave.module.css'

export default function Leave() {

    const [isAgree, setIsAgree] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = () => {
        if (!isAgree) {
            setError('유의사항을 확인하고 동의해주세요.')
        } else {
            // 회원탈퇴
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
                    지금 탈퇴하면 <span className={styles.redText}>0권</span>의 데이터가 사라져요. 😥
                </span>
                <span className={styles.warningMsg}>정말 탈퇴하실 건가요? 탈퇴하시는 이유를 알려주세요.</span>
            </div>
            <div className={styles.reasonWrapper}>
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
            </div>
            <div className={styles.notice}>
                <span className={styles.noticeTitle}>회원탈퇴 유의사항</span>
                <ul className={styles.noticeList}>
                    <li>· 탈퇴 시, 모든 데이터가 삭제되며 계정은 복구할 수 없습니다.</li>
                    <li>· 탈퇴 후 동일한 아이디로 재가입이 불가합니다.</li>
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
                <button className={styles.cancelBtn}>돌아가기</button>
            </div>
        </div>
    )
}