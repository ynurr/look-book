import styles from './DeleteModal.module.css';

interface DeleteModalProps {
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({ message, onCancel, onConfirm }: DeleteModalProps) {
    return (
        <div className={styles.modal}>
            <p>{message || "정말 삭제하시겠습니까?"}</p>
            <div className={styles.confirmBtnBox}>
                <button onClick={onCancel} className={styles.cancelBtn}>취소</button>
                <button onClick={onConfirm} className={styles.confirmBtn}>확인</button>
            </div>
        </div>
    )
}