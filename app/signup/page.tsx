import styles from './Signup.module.css'

export default function SignUp() {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>회원가입</h2>
                <div className={styles.formGroup}>
                    <label>이메일</label>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} placeholder='이메일을 입력하세요'></input>
                        <button className={styles.checkBtn}>중복확인</button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>닉네임</label>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} placeholder='닉네임을 입력하세요'></input>
                        <button className={styles.checkBtn}>중복확인</button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>비밀번호</label>
                    <input placeholder='비밀번호를 입력하세요'></input>
                </div>
                <div className={styles.formGroup}>
                    <label>비밀번호 확인</label>
                    <input placeholder='비밀번호를 다시 입력하세요'></input>
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
                <button className={styles.signupBtn}>가입하기</button>
                <div className={styles.links}>
                    <a href="/login">이미 계정이 있으신가요? 로그인</a>
                </div>
            </div>
        </div>
    )
}