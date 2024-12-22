'use client'

import { useState } from 'react'
import styles from './Signup.module.css'

export default function SignUp() {
    const [id, setId] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        const data = {
            id,
            nickname,
            password
        }

        try {
            const response = await fetch('/pages/api/db/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.status === 200) {
                alert('회원가입 성공')
            } else {
                alert(result.message || '회원가입 실패')
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>아이디</label>
                        <div className={styles.inputGroup}>
                            <input 
                                className={styles.inputField} 
                                placeholder='아이디를 입력하세요'
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            ></input>
                            <button className={styles.checkBtn}>중복확인</button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>닉네임</label>
                        <div className={styles.inputGroup}>
                            <input 
                                className={styles.inputField} 
                                placeholder='닉네임을 입력하세요'
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            ></input>
                            <button className={styles.checkBtn}>중복확인</button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input 
                            placeholder='비밀번호를 입력하세요'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                    </div>
                    <div className={styles.formGroup}>
                        <label>비밀번호 확인</label>
                        <input
                            placeholder='비밀번호를 다시 입력하세요'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></input>
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.agreementGroup}>
                            <div className={`${styles.checkboxGroup} ${styles.all}`}>
                                <input type='checkbox'/>
                                <span>전체 동의</span>
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input type='checkbox'/>
                                <span>서비스 이용약관 동의 (필수)</span>
                            </div>
                            <div className={`${styles.checkboxGroup} ${styles.privacy}`}>
                                <input type='checkbox'/>
                                <span>개인정보 처리방짐 동의 (필수)</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className={styles.signupBtn}>가입하기</button>
                </form>
                <div className={styles.links}>
                    <a href="/login">이미 계정이 있으신가요? 로그인</a>
                </div>
            </div>
        </div>
    )
}