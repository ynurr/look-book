import styles from './Login.module.css'

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>로그인</h2>
                <div className={styles.formGroup}>
                    <input className={styles.inputField} placeholder='이메일'></input>
                    <input className={styles.inputField} placeholder='비밀번호'></input>
                </div>
                <button className={styles.loginBtn}>로그인</button>
                <div className={styles.links}>
                    <a href="">아이디 찾기</a>
                    <span className={styles.separator}>|</span>
                    <a href="">비밀번호 찾기</a>
                    <span className={styles.separator}>|</span>
                    <a href="/signup">회원가입</a>
                </div>
                <div className={styles.line}>또는</div>
                <div className={styles.snsLogin}>
                    <p>SNS 로그인</p>
                </div>
            </div>
        </div>
    )
}