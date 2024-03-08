import styles from './edit-building.module.scss';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ViewBuilding } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog } from '@mui/material';


export interface EditBuildingProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: ViewBuilding | null;
}

interface Form {
  name: string;
}

const EditBuildingComponent: React.FC<EditBuildingProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });
  const { handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors } } = useForm<Form>({
      resolver: yupResolver(validationSchema)
    });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: Form) => {
    onUpdate(data);
    onClose();
    reset();
  };

  
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Building</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                className="form-control"
                label="Name*"
                variant="outlined"
                placeholder="Enter Building Name"
                {...field}
                size="medium"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ margin: '10px' }}
              />
            )}
          />
          <Box className={styles['update_modal-buttons']}>
            <Button
              className={styles['edit_button']}
              variant="contained"
              color="primary"
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {onClose(); reset()}}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditBuildingComponent;
