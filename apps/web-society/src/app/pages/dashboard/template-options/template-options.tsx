import { Box, Button, Modal } from '@mui/material';
import styles from './template-options.module.scss';


export interface TemplateOptionsProps {
  onSelect: (option: string) => void;
  open: boolean;
  onClose: () => void;
}

export function TemplateOptions({ onSelect, open, onClose, }: TemplateOptionsProps) {
  const handleOptionClick = (option: string) => {
    onSelect(option);
  };
  return (
    <Modal open={open} onClose={onClose}>
    <Box  className={styles['template_modal_container']}>
      <h2 className={styles['h2_tag']}>Select Template</h2>
      <Box className={styles['option_container']}>
      <Button color="info" variant="contained" onClick={() => handleOptionClick('building')}>
        Building
      </Button>
      <Button color="info" variant="contained" onClick={() => handleOptionClick('flat')}>
        Flat
      </Button>
      <Button color="info" variant="contained" onClick={() => handleOptionClick('resident')}>
        Resident
      </Button>
      <Button color="info" variant="contained" onClick={() => handleOptionClick('vehicle')}>
        Vehicle
      </Button>
      </Box>
    <Box>
    {/* <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button> */}
    </Box>
    </Box>
    </Modal>
  );
}

export default TemplateOptions;
