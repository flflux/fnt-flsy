import styles from './delete-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/* eslint-disable-next-line */
export interface DeleteAdminProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  adminData: Manager | null;
}


interface Manager {
  id: number;
  isPrimary: boolean;
  societyRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}

export function DeleteAdmin({
  open,
  onClose,
  onDelete,
adminData
}: DeleteAdminProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Manager</h2>
        <p>Are you sure you want to delete <b>{adminData?.user?.firstName} {adminData?.user?.lastName}</b>?</p>
        <Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={styles['delete_btn']}
            sx={{ ml: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteAdmin;
