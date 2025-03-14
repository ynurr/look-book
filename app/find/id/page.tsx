'use client'

import { useState } from "react";
import styles from "./FindId.module.css";

export default function FindId() {
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [maskedId, setMaskedId] = useState<string|null>(null);
    const [notFound, setNotFound] = useState(false); 

    const handleFindId = async () => {
        const response = await fetch("/api/db/find/id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, nickname })
        });

        const data = await response.json();

        if (data.id) {
            const originalId = data.id;
            setMaskedId(originalId.slice(0, -4) + "****");
        } else {
            setNotFound(true);
        }
    };

    return (
        <div className={styles.container}>
            {
                maskedId ?
                    (
                        <div className={styles.wrapper}>
                            <p className={styles.title}>아이디 찾기</p>
                            <div className={styles.result}>
                                <p>{nickname} 님의 아이디는</p>
                                <p><span className={styles.maskedId}>{maskedId}</span> 입니다.</p> 
                            </div>
                            <button 
                                className={styles.btn}
                                onClick={() => window.location.href = "/login"}
                            >
                                로그인
                            </button>
                        </div>
                    ) : notFound ? (
                        <div className={styles.wrapper}>
                            <p className={styles.title}>아이디 찾기</p>
                            <div className={styles.resultNotFound}>
                                <p>회원정보가 존재하지 않습니다.</p>
                                <p>지금 바로 회원이 되어보세요!</p>
                            </div>
                            <button 
                                className={styles.signupBtn} 
                                onClick={() => window.location.href = "/signup"}
                            >
                                회원가입 하러 가기 🏃‍♂️
                            </button>
                        </div>
                    ) : (
                        <div className={styles.wrapper}>
                            <p className={styles.title}>아이디 찾기</p>
                            <p className={styles.label}>이름</p>
                            <input
                                type="text"
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                            <p className={styles.label}>닉네임</p>
                            <input
                                type="text"
                                placeholder="닉네임을 입력해주세요"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}/>
                            <button 
                                className={styles.btn}
                                onClick={handleFindId}
                            >
                                아이디 찾기
                            </button>
                        </div>
                    )
            }
        </div>
    );
}