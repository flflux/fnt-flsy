import { CircularProgress, Modal } from '@mui/material';
import styles from './loading.module.scss';

export interface LoadingProps {
  open: boolean;
  onClose: () => void;
}

export function Loading({ open, onClose }: LoadingProps) {
  return (
    <Modal open={open} onClose={onClose}>
    <div className={styles['modal-container']}>
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "75vh" }}><CircularProgress /></div>
    </div>
    </Modal>
  );
}

export default Loading;
