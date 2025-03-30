'use client'

import { useState } from "react";
import styles from "./FindPassword.module.css";

export default function FindPassword() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [isVerified , setIsVerified ] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleFindPassword = async () => {
        if (!id.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }

        const response = await fetch("/api/db/find/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, name })
        });

        const data = await response.json();

        if (data.success) {
            setIsVerified(true);
        } else {
            alert('일치하는 사용자를 찾을 수 없습니다.');
        }
    };

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

    const handleSubmit = async () => {

        if (!password) {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (!validatePassword(password)) {
            alert('새 비밀번호가 올바르지 않습니다.');
            return;
        }

        try {
            const response = await fetch('/api/db/account/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, password })
            })

            const result = await response.json();

            if (response.status === 200) {
                alert('비밀번호가 변경되었습니다.');
                window.location.href = '/login'; 
            } else {
                alert(result.message || '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className={styles.container}>
            {
                isVerified ?
                    (
                        <div className={styles.wrapper}>
                            <p className={styles.title}>비밀번호 재설정</p>
                            <div className={styles.rule}>
                                <p className={styles.head}>비밀번호 변경 규칙</p>
                                <p className={styles.info}>· 영문, 숫자, 특수문자의 3가지 조합과 8자리 이상이어야 합니다.</p>
                                <p className={styles.info}>· 공백 및 4글자 이상의 연속 문자는 불가합니다.</p>
                            </div>
                            <p className={styles.label}>새 비밀번호</p>
                            <input
                                className={styles.pwInput}                                type="password"
                                placeholder="새 비밀번호를 입력해주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            <p className={styles.label}>새 비밀번호 확인</p>
                            <input
                                className={styles.pwInput}
                                type="password"
                                placeholder="새 비밀번호를 다시 입력해주세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <button 
                                className={styles.btn}
                                onClick={handleSubmit}
                            >
                                변경하기
                            </button>
                        </div>
                    ) : (
                        <div className={styles.wrapper}>
                            <p className={styles.title}>비밀번호 찾기</p>
                            <p className={styles.label}>아이디</p>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}/>
                            <p className={styles.label}>이름</p>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                            <button 
                                className={styles.btn}
                                onClick={handleFindPassword}
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                    )
            }
        </div>
    );
}