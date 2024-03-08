import styles from './edit-vehicle.module.scss';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { EditVehicle } from '@fnt-flsy/data-transfer-types';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { VehicleType } from '@prisma/client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// type EditVehicleDataOrNull = EditVehicle | null;


interface EditVehicleProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: EditVehicle) => void;
  initialData: EditVehicle | null;
}

const EditVehicleComponent: React.FC<EditVehicleProps> = ({ open, onClose, onUpdate, initialData }) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Please Select Option')
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<EditVehicle>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('type', initialData.type);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: EditVehicle) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['edit_modal_container']}>
        <h2>Edit Vehicle</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: ' Vehicle Name is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="New Name"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ margin: "10px" }}
              />
            )}
          />
          <FormControl sx={{ m: 1, width: 260 }}>
            <InputLabel id="my-select">Type</InputLabel>
            <Controller
              name="type"
              control={control}
              // defaultValue=""
              rules={{ required: 'Vehicle Type is required' }}
              render={({ field }) => (
                <Select
                  labelId='my-select'
                  id="my-select"
                  label="Type"
                  {...field}
                  error={!!errors.type}
                  
                >
                  <MenuItem value="TWO_WHEELER">Two Wheeler</MenuItem>
                  <MenuItem value="FOUR_WHEELER">Four Wheeler</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </Select>
              )}
            />
          </FormControl>
          <Box sx={{ mt: "10px" }}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button variant="contained" color="inherit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditVehicleComponent;
