import styles from './delete-fl-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/* eslint-disable-next-line */
export interface DeleteFLAdminProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  Status: boolean | undefined ;
  userData: FLUser | null;
}

interface FLUser {
  id: number;
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}


export function DeleteFLAdmin({
  open,
  onClose,
  onDelete,
  Status,
  userData
}: DeleteFLAdminProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>{Status===true ? 'Deactivate' : 'Activate'} User</h2>
        <p>Are you sure you want to {Status===true ? 'deactivate' : 'activate'} user <b>{userData?.firstName} {userData?.lastName}</b>?</p>
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

export default DeleteFLAdmin;
