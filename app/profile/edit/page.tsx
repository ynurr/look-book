'use client'

import { useEffect, useState } from "react"
import styles from './ProfileEdit.module.css'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { checkNicknameDuplication, fetchUserProfile } from "@/store/slices/accoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserStat } from "@/store/slices/statSlice";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.account.id);
    const userName = useSelector((state: RootState) => state.account.name);
    const userNickname = useSelector((state: RootState) => state.account.nickname);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const userGoal = useSelector((state: RootState) => state.stat.goal);
    const [goal, setGoal] = useState(0);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            try {
                dispatch(fetchUserProfile({ user_id: session?.user.sub, password: '' }))
                // dispatch(fetchUserStat({ user_id: session.user.sub }))
            } catch (error) {
                alert('회원 정보 조회 중 오류가 발생했습니다.');
            }
        }
    }, [session, dispatch])

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
        if (userNickname) {
            setNickname(userNickname);
        }
        if (userGoal) {
            setGoal(userGoal);
        }
    }, [userName, userNickname, userGoal]); 

    const checkNickname = async (nickname: string) => {
    
        const cleanedNickname = nickname.trim();
        const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

        if (!nicknameRegex.test(cleanedNickname)) {
            alert('닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.');
            setIsNicknameChecked(false);
            return;
        }
    
        if (cleanedNickname.length > 8) {
            alert('닉네임은 8자리까지 가능합니다.');
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
            alert(error);
            setIsNicknameChecked(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        if (nickname !== userNickname && !isNicknameChecked) {
            alert('닉네임 중복확인을 완료해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/db/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: session?.user.sub,
                    name,
                    nickname,
                    goal
                })
            })

            const result = await response.json();

            if (response.status === 200) {
                router.push('/library');
                return;
            } else {
                alert(result.message || '프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            alert('프로필 수정 중 오류가 발생했습니다.');
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.contents}>
                <h2>프로필 수정</h2>
                <hr/>
                <div>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>아이디</th>
                                <td>{userId}</td>
                            </tr>
                            <tr>
                                <th>이름</th>
                                <td className={styles.inputGroup}>
                                    <input 
                                        className={`${styles.checkInput} ${styles.nicknameInput}`} 
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }}
                                    ></input>
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
                                    <span className={styles.info}>8자리 이하 한글, 영문, 숫자만 가능</span>
                                </td>
                            </tr>
                            <tr>
                                <th>올해 독서 목표</th>
                                <td>
                                    <select 
                                        className={styles.goalSelect}
                                        value={goal}
                                        onChange={(e) => setGoal(Number(e.target.value))}
                                    >
                                        {[...Array(100).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}권</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr/>
                    <div className={styles.btnWrapper}>
                        <Link href="/library" className={styles.cancelBtn}>
                            취소
                        </Link>
                        <button onClick={handleSubmit} className={styles.submitBtn}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    )
}