'use client'

import { useState } from 'react'
import styles from './Signup.module.css'
import { checkNicknameDuplication } from '@/store/slices/accoutSlice'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import Link from 'next/link'

export default function SignUp() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [idError, setIdError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordCheckError, setPasswordCheckError] = useState(false);
    const [nicknameError, setNickNameError] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
    const [passwordValidError, setPasswordValidError] = useState(false);
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [goal, setGoal] = useState(12);
    const dispatch = useDispatch<AppDispatch>();
    
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
            const result = await dispatch(checkNicknameDuplication({ nickname })).unwrap(); 
                        
            if (!result) {
                throw new Error("응답이 올바르지 않습니다.");
            }

            if (result.status === 200) {
                alert(result.message);
                setIsNicknameChecked(true);
            } else {
                alert(result.message);
                setIsNicknameChecked(false);
            }

        } catch (error) {
            alert(error)
            setIsNicknameChecked(false)
        }
    }

    const checkId = async (id: string) => {
        const idRegex = /^[a-zA-Z0-9]+$/;

        if (!idRegex.test(id)) {
            alert("아이디는 영어와 숫자만 사용할 수 있습니다.");
            setIsIdChecked(false);
            return;
        }

        if (id.length < 6) {
            alert("아이디는 6자 이상이어야 합니다.");
            setIsIdChecked(false);
            return;
        }

        if (id.length > 16) {
            alert("아이디는 16자 이하여야 합니다.");
            setIsIdChecked(false);
            return;
        }
        
        try {
            const response = await fetch('/api/db/check/id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })

            const data = await response.json()

            if (response.ok) {
                alert(data.message)
                setIsIdChecked(true)
            } else {
                alert(data.message)
                setIsIdChecked(false)
            }
        } catch (error) {
            alert(error)
            setIsIdChecked(false)
        }
    }
    
    const handleAllChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setIsAllChecked(checked)
        setIsTermsChecked(checked)
        setIsPrivacyChecked(checked)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!id) {
            alert('사용할 아이디를 입력해주세요.')
            return
        }

        if (!name) {
            alert('이름을 입력해주세요.')
            return
        }

        if (!nickname) {
            alert('사용할 닉네임을 입력해주세요.')
            return
        }

        if (!isIdChecked) {
            alert('아이디 중복 확인을 완료해주세요.')
            return
        }

        if (!isNicknameChecked) {
            alert('닉네임 중복 확인을 완료해주세요.')
            return
        }
        
        if (!isTermsChecked || !isPrivacyChecked) {
            alert('이용약관 확인 후 동의해주세요.')
            return
        }

        setIdError(false)
        setPasswordError(false)
        setPasswordCheckError(false)
        setNickNameError(false)
        setIsError(false)
        setPasswordValidError(false)

        let hasError = false

        if (!id) {
            setIdError(true)
            hasError = true
        }
        if (!password) {
            setPasswordError(true)
            hasError = true
        }
        if (password !== confirmPassword) {
            setPasswordCheckError(true)
            hasError = true
        }
        if (!nickname) {
            setNickNameError(true)
            hasError = true
        }
    
        if (!validatePassword(password)) {
            setPasswordValidError(true)
            hasError = true
        }

        if (hasError) {
            setIsError(true)
            return
        }

        const data = {
            id,
            name,
            nickname,
            password,
            goal
        }

        try {
            const response = await fetch('/api/db/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.status === 200) {
                alert('가입이 완료되었습니다! 로그인 후 이용해주세요.');
                window.location.href = '/login?callbackUrl=/home';
            } else {
                alert(result.message || '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다.');
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
                                onChange={(e) => {
                                    setId(e.target.value) 
                                    setIsIdChecked(false)
                                }}
                            ></input>
                            <button 
                                className={styles.checkBtn}
                                onClick={() => checkId(id)}
                                type="button"
                            >중복확인</button>
                        </div>
                    </div>
                    {
                        idError && isError && <p className={styles.error}>ID를 입력해주세요.</p>
                    }
                    <div className={styles.formGroup}>
                        <label>이름</label>
                        <div className={styles.inputGroup}>
                            <input 
                                className={styles.inputField} 
                                placeholder='이름을 입력하세요'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value) 
                                }}
                            ></input>
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
                            <button 
                                className={styles.checkBtn}
                                onClick={() => {
                                    checkNickname(nickname)
                                    setIsNicknameChecked(false)
                                }}
                                type="button"
                            >중복확인</button>
                        </div>
                    </div>
                    {
                        nicknameError && isError && <p className={styles.error}>닉네임을 입력해주세요.</p>
                    }
                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input
                            placeholder='비밀번호를 입력하세요'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            ></input>
                        <span className={styles.pwInfo}>영문, 숫자, 특수문자 3가지 조합 8자리 이상</span>
                        <span className={styles.pwInfo}>공백 및 4글자 이상의 연속 문자 불가</span>
                    </div>
                    {
                        passwordError && isError && <p className={styles.error}>비밀번호를 입력해주세요.</p>
                    }
                    {
                        !passwordError && passwordValidError && isError && <p className={styles.error}>비밀번호를 확인해주세요.</p>
                    }
                    <div className={styles.formGroup}>
                        <label>비밀번호 확인</label>
                        <input
                            placeholder='비밀번호를 다시 입력하세요'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type='password'
                        ></input>
                    </div>
                    {
                        passwordCheckError && isError && <p className={styles.error}>비밀번호가 일치하지 않습니다.</p>
                    }
                    <div className={styles.formGroup}>
                        <label>올해 독서 목표</label>
                        <div className={styles.inputGroup}>
                            <select 
                                className={styles.goalSelect}
                                value={goal}
                                onChange={(e) => setGoal(Number(e.target.value))}
                            >
                                {[...Array(100).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}권</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.agreementGroup}>
                            <div className={`${styles.checkboxGroup} ${styles.all}`}>
                                <input 
                                    type='checkbox'
                                    checked={isAllChecked} 
                                    onChange={handleAllChecked}
                                />
                                <span>전체 동의</span>
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input 
                                    type='checkbox'
                                    checked={isTermsChecked}
                                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                                />
                                <span>서비스 이용약관 동의 (필수)</span>
                                <Link href="/terms/service-terms" className={styles.termsBtn}>보기</Link>
                            </div>
                            <div className={`${styles.checkboxGroup} ${styles.privacy}`}>
                                <input 
                                    type='checkbox'
                                    checked={isPrivacyChecked} 
                                    onChange={(e) => setIsPrivacyChecked(e.target.checked)} 
                                />
                                <span>개인정보 처리방짐 동의 (필수)</span>
                                <Link href="/terms/privacy-policy" className={styles.termsBtn}>보기</Link>
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