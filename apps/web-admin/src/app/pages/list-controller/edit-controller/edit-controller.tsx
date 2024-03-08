import styles from './edit-controller.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';


export interface EditControllerProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: Form | null;
}

interface Form {
  // name: string;
  deviceId:string;
  type:string;
  thingId: string;
  thingKey: string,
  channelId: string,
}


const EditControllerComponent: React.FC<EditControllerProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    // name: yup.string().required('Name is required'),
    deviceId: yup.string().required('Device Id is required'),
    type: yup.string().required('Type is required'),
    thingId: yup.string().required('Thing Id is required'),
    thingKey: yup.string().required('Thing Key is required'),
    channelId: yup.string().required('Channel Id is required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
    }
  });


  useEffect(() => {
    if (initialData) {
      // setValue('name', initialData.name);
      setValue('deviceId', initialData.deviceId);
      setValue('thingId', initialData.thingId);
      setValue('thingKey', initialData.thingKey);
      setValue('channelId', initialData.channelId);
      setValue('type', initialData.type);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: Form) => {
    onUpdate(data);
    onClose();
  };
  const closeModal = () => {
    onClose();
  }



  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>
          Edit Device
        </h2>

        <form onSubmit={handleSubmit(handleUpdate)}>
           {/* <Box sx={{  display: 'grid',
            columnGap: 1,
            rowGap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)', padding:"5px"}}
            > */}
            {/* <Box className={styles['modal_first_container']}> */}
          {/* <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Device Name is required' }}
            render={({ field }) => (
              <TextField
                type='text'
                sx={{ m: 1, width: 300 }}
                {...field}
                label="Name*"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          /> */}

            <Controller
              name="deviceId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...field}
                  label="Device ID"
                  variant="outlined"
                  sx={{ m: 1, width: 300 }}
                  error={!!errors.deviceId}
                  helperText={errors.deviceId?.message}
                />
              )}
            />
            <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
              <InputLabel>Type</InputLabel>
              <Controller
                name="type"
                control={control}
                defaultValue="ACCESS"
                render={({ field }) => (
                  <Select {...field} label="Type" disabled error={!!errors.type}
                  // MenuProps={{
                  //   PaperProps: {
                  //     style: {
                  //       maxHeight: 75
                  //     },
                  //   },
                  // }}
                  >
                    <MenuItem value="ACCESS">Access</MenuItem>
                    <MenuItem value="MONCON">Moncon</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, width: 300 }}  error={!!errors.type}>
            <InputLabel>Subtype*</InputLabel>
            <Controller
              name="subtype"
              control={control}
              defaultValue="GATE"

              render={({ field }) => (
                <Select {...field} label="Subtype*" defaultValue='' error={!!errors.type} disabled>

                  <MenuItem value="GATE">Gate</MenuItem>
                 
                </Select>
              )}
            />
            <FormHelperText sx={{ color:"#d32f2f"}}>{errors.type?.message}</FormHelperText>
          </FormControl>
            <Controller
              name="thingId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...field}
                  label="Thing ID"
                  variant="outlined"
                  sx={{ m: 1, width: 300 }}
                  error={!!errors.thingId}
                  helperText={errors.thingId?.message}
                />
              )}
            />
            <Controller
              name="thingKey"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...field}
                  label="Thing Key"
                  variant="outlined"
                  sx={{ m: 1, width: 300 }}
                  error={!!errors.thingKey}
                  helperText={errors.thingKey?.message}
                />
              )}
            />
            {/* </Box>
            <Box className={styles['modal_second_container']}> */}

            <Controller
              name="channelId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...field}
                  label="Channel ID"
                  variant="outlined"
                  sx={{ m: 1, width: 300 }}
                  error={!!errors.channelId}
                  helperText={errors.channelId?.message}
                />
              )}
            />


            {/* </Box> */}
            {/* </Box> */}
          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit" className={styles['edit_button']} >
              Save
            </Button>
            <Button variant="contained" color="secondary" type="submit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditControllerComponent;
