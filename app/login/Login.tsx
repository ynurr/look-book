'use client'

import { useState } from 'react'
import styles from './Login.module.css'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const callbackUrl = searchParams.get('callbackUrl') || '/home';
    
    const handleSubmit = async () => {
        if (!id) {
            setError('아이디를 입력해주세요.');
            return;
        } else if (!password) {
            setError('비밀번호를 입력해주세요.');
            return;
        } 
        setError('');

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username: id,
                password: password,
                callbackUrl
            })

            if (result?.error) {
                setError(result.error);
            } 
            
            if (result?.status === 200) {
                router.push(result.url || '/home');
                return;
            }
        } catch (err) {
            alert("로그인 중 오류가 발생했습니다.");
            console.error(err);
        }
    }

    const handleKakaoLogin = async () => {
        try {
            await signIn("kakao", { callbackUrl });
        } catch (err) {
            alert("카카오 로그인 중 오류가 발생했습니다.");
            console.error(err);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>로그인</h2>
                <div>
                    <div className={styles.formGroup}>
                        <input 
                            className={styles.inputField} 
                            placeholder='아이디'
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        ></input>
                        <input 
                            className={styles.inputField} 
                            placeholder='비밀번호'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                        ></input>
                    </div>
                    {
                        error && <p className={styles.error}>{error}</p>
                    }
                    <button onClick={handleSubmit} className={styles.loginBtn}>로그인</button>
                </div>
                <div className={styles.links}>
                    <a href="/find/id">아이디 찾기</a>
                    <span className={styles.separator}>|</span>
                    <a href="/find/password">비밀번호 찾기</a>
                    <span className={styles.separator}>|</span>
                    <a href="/signup">회원가입</a>
                </div>
                <div className={styles.line}>또는</div>
                <div className={styles.snsLogin}>
                    <button onClick={handleKakaoLogin} className={styles.kakaoBtn}>
                        <Image
                            src="/images/kakao_login.png"
                            alt="카카오 로그인"
                            width={300}
                            height={40}
                            priority
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}