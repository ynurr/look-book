'use client'

import { useState } from "react"
import styles from './AccountModify.module.css'
import Link from "next/link";

export default function Modify() {

    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleVerify = () => {
        if (!password) {
            setError('비밀번호를 입력해주세요.')
        } else if (password === '1234') {
            setIsVerified(true)
        } else {
            setError('비밀번호가 일치하지 않습니다.')
            setPassword('')
        }
    }
    
    return (
        <div className={styles.container}>
            {
                isVerified ? (
                    <div className={styles.contents}>
                        <h2>회원정보 수정</h2>
                        <hr/>
                        <div>
                            <table className={styles.table}>
                                <tr>
                                    <th>아이디</th>
                                    <td>xxx</td>
                                </tr>
                                <tr>
                                    <th className={styles.pwLabel}>새 비밀번호</th>
                                    <td className={styles.pwInput}>
                                        <input type="password" className={styles.checkInput} placeholder="새 비밀번호"></input>
                                        <span className={styles.pwInfo}>영문, 숫자, 특수문자 3가지 조합 8자리 이상</span>
                                        <span className={styles.pwInfo}>공백 및 3글자 이상의 연속 문자 불가</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>새 비밀번호 확인</th>
                                    <td><input type="password" className={styles.checkInput} placeholder="새 비밀번호 확인"></input></td>
                                </tr>
                                <tr>
                                    <th>닉네임</th>
                                    <td>신유</td>
                                </tr>
                            </table>
                            <hr/>
                            <div className={styles.leaveWrapper}>
                                <span className={styles.leaveInfo}>회원탈퇴 후 동일한 아이디로 재가입이 불가합니다.</span>
                                <Link href="/account/leave">
                                    <button className={styles.leaveBtn}>회원탈퇴</button>
                                </Link>
                            </div>
                            <div className={styles.btnWrapper}>
                                <button className={styles.cancelBtn}>취소</button>
                                <button className={styles.submitBtn}>확인</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.contents}>
                        <h2>비밀번호 확인</h2>
                        <hr/>
                        <p className={styles.info}>안전한 개인정보를 위해 비밀번호를 한번 더 입력해주세요.</p>
                        <div className={styles.inputWrapper}>
                            <input
                                className={styles.inputPw}
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(''); // 입력 중일 때 에러 메시지 초기화
                                }}
                            ></input>
                            <button className={styles.btnPw} onClick={handleVerify}>확인</button>
                        </div>
                        <p className={styles.errorMsg}>{error}</p>
                    </div>
                )
            }
        </div>
    )
}