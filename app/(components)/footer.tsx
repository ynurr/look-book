import styles from './../(styles)/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.name}> (주) LookBook </p>
          <p className={styles.copyright}> © 2024 LookBook. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
}