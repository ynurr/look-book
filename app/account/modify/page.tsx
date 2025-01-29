'use client'

import { useEffect, useState } from "react"
import styles from './AccountModify.module.css'
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Modify() {

    const { data: session } = useSession();
    
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordCheckError, setPasswordCheckError] = useState(false)
    const [passwordValidError, setPasswordValidError] = useState(false)
    const [nicknameError, setNickNameError] = useState(false)
    const [isError, setIsError] = useState(false)
    const [userId, setUserId] = useState('')
    const [isNicknameChecked, setIsNicknameChecked] = useState(false)
        
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault(); 

        if (!password) {
            setError('비밀번호를 입력해주세요.')
            return
        }

        const data = {
            sub: session?.user.sub,
            password
        }

        try {
            const response = await fetch('/api/db/account/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.status === 200) {
                setIsVerified(true)
                console.log("isVerified 상태:", true);
                setUserId(result.id)
                setNickname(result.nickname)
            } else {
                setError(result.message)
            }
        } catch (error) {
            alert("사용자 정보 조회 중 오류가 발생했습니다.")
            console.error(error)
        }
    }

    const validatePassword = (password: string) => {
        const minLength = 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        const hasNoSpaces = !/\s/.test(password)
        const hasNoConsecutiveChars = !/(.)\1{3,}/.test(password)

        return (
            password.length >= minLength &&
            (hasUpperCase || hasLowerCase) &&
            hasNumber &&
            hasSpecialChar &&
            hasNoSpaces &&
            hasNoConsecutiveChars
        );
    }

    const checkNickname = async (nickname: string) => {
    
        const cleanedNickname = nickname.trim();
        const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

        if (!nicknameRegex.test(cleanedNickname)) {
            alert('닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.')
            setIsNicknameChecked(false);
            return;
        }
    
        if (cleanedNickname.length > 8) {
            alert('닉네임은 8자리까지 가능합니다.')
            setIsNicknameChecked(false);
            return;
        }

        try {
            const response = await fetch('/api/db/check/nickname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname })
            })

            const data = await response.json()

            if (response.ok) {
                alert(data.message)
                setIsNicknameChecked(true)
            } else {
                alert(data.message)
                setIsNicknameChecked(false)
            }
        } catch (error) {
            alert(error)
            setIsNicknameChecked(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setPasswordError(false)
        setPasswordCheckError(false)
        setNickNameError(false)
        setIsError(false)
        setPasswordValidError(false)

        let hasError = false

        if (!newPassword) {
            setPasswordError(true)
            hasError = true
        }

        if (newPassword !== confirmPassword) {
            setPasswordCheckError(true)
            hasError = true
        }
    
        if (!validatePassword(newPassword)) {
            setPasswordValidError(true)
            hasError = true
        }

        if (!isNicknameChecked) {
            alert('닉네임 중복 확인을 완료해주세요.')
            return
        }
        
        if (hasError) {
            setIsError(true)
            return
        }

        const data = {
            sub: session?.user.sub,
            nickname,
            password: newPassword
        }

        try {
            const response = await fetch('/api/db/account/modify', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.status === 200) {
                alert('회원정보수정 성공')
            } else {
                alert(result.message || '회원정보수정 실패')
            }
        } catch (error) {
            alert('회원정보수정 중 오류가 발생했습니다.')
        }
    }
    
    return (
        <div className={styles.container}>
            {
                isVerified ? (
                    <div className={styles.contents}>
                        <h2>회원정보 수정</h2>
                        <hr/>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <table className={styles.table}>
                                    <tbody>
                                        <tr>
                                            <th>아이디</th>
                                            <td>{userId}</td>
                                        </tr>
                                        <tr>
                                            <th className={styles.pwLabel}>새 비밀번호</th>
                                            <td className={styles.pwInput}>
                                                <input 
                                                    type="password" 
                                                    className={styles.checkInput}
                                                    placeholder="새 비밀번호"
                                                    value={newPassword}
                                                    onChange={(e) => {setNewPassword(e.target.value)}}
                                                    >
                                                </input>
                                                <span className={styles.pwInfo}>영문, 숫자, 특수문자 3가지 조합 8자리 이상</span>
                                                <span className={styles.pwInfo}>공백 및 4글자 이상의 연속 문자 불가</span>
                                                {
                                                    passwordError && isError && <p className={styles.error}>비밀번호를 입력해주세요.</p>
                                                }
                                                {
                                                    !passwordError && passwordValidError && isError && <p className={styles.error}>비밀번호를 확인해주세요.</p>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>새 비밀번호 확인</th>
                                            <td>
                                                <input 
                                                    type="password" 
                                                    className={styles.checkInput} 
                                                    placeholder="새 비밀번호 확인"
                                                    value={confirmPassword}
                                                    onChange={(e) => {setConfirmPassword(e.target.value)}}>
                                                </input>
                                                {
                                                    passwordCheckError && isError && <p className={styles.error}>비밀번호가 일치하지 않습니다.</p>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>닉네임</th>
                                            <td className={styles.inputGroup}>
                                                <input 
                                                    className={`${styles.checkInput} ${styles.nicknameInput}`} 
                                                    value={nickname}
                                                    onChange={(e) => {
                                                        setNickname(e.target.value)
                                                        setIsNicknameChecked(false)
                                                    }}
                                                ></input>
                                                <button 
                                                    className={styles.checkBtn}
                                                    onClick={() => checkNickname(nickname)}
                                                    type="button"
                                                >중복확인</button>
                                                <span className={styles.pwInfo}>8자리 이하 한글, 영문, 숫자만 가능</span>
                                                {
                                                    nicknameError && isError && <p className={styles.error}>닉네임을 입력해주세요.</p>
                                                }
                                                {/* {
                                                    nicknameError && isError && <p className={styles.error}>한글, 영어, 숫자 8자리까지만 가능합니다.</p>
                                                } */}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr/>
                                <div className={styles.leaveWrapper}>
                                    <Link href="/account/leave">
                                        <button className={styles.leaveBtn}>회원탈퇴 &gt;</button>
                                    </Link>
                                </div>
                                <div className={styles.btnWrapper}>
                                    <Link href="/home">
                                        <button className={styles.cancelBtn}>취소</button>
                                    </Link>
                                    <button type="submit" className={styles.submitBtn}>확인</button>
                                </div>
                            </div>
                        </form>
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