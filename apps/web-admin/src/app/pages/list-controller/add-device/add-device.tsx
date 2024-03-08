import styles from './add-device.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { AddDevice, Building, Device, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';

import { environment } from '../../../../environments/environment';
import { FormHelperText } from '@mui/material';
import { SocietyContext, UserContext } from "../../../contexts/user-contexts";
import { useParams } from 'react-router-dom';

interface Form {
  deviceId: number;
}

/* eslint-disable-next-line */
export interface AddDeviceProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

const AddDeviceComponent: React.FC<AddDeviceProps> = ({ open, onClose, onSubmit }) => {
  const [deviceList, setDeviceLists] = useState<Device[]>([]);
  const apiUrl = environment.apiUrl;
  const user=useContext(UserContext);
  const validationSchema = yup.object().shape({
    deviceId: yup.number().required('Device Name is Required'),

  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    
  });

  const params=useParams();
  const societyContext=useContext(SocietyContext);
  console.log("society Context on Device View:",societyContext);
  console.log("society id:",societyContext?.id);

  const handleFormSubmit = (data: Form) => {
    onSubmit(data);
    reset();
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const getAllDevices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/devices`, {
        withCredentials: true,
      });

      const { content, total } = response.data;
      setDeviceLists(content);

      const devices = response.data.content;
      // const filteredController = controller.filter(
      //   (flat: { id: number; number: string; isActive: boolean; floor: { id: any; number: string; building: { id: any; name: string } } }) =>
      //     flat.isActive === true
      // );
      setDeviceLists(devices);

      console.log("devices:", devices);

    } catch (error) {
      console.log("Error in fetching Devices", error);
    }
  };

  useEffect(() => {
    getAllDevices();
  }, [user])


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>
          Add Device
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                label="Name"
                variant="outlined"
                size="medium"
                {...field}
                sx={{ m: 1, width: 300 }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="deviceId"
            control={control}
            // defaultValue=""
            render={({ field }) => (
              <TextField
                type="text"
                {...field}
                label="device ID"
                variant="outlined"
                sx={{ m: 1, width: 300 }}
                error={!!errors.deviceId}
                helperText={errors.deviceId?.message}
              />
            )}
          /> */}

          <FormControl sx={{ width: 260 }} fullWidth>

            <InputLabel htmlFor="floor">Select Device</InputLabel>
            <Controller
              name="deviceId"
              control={control}
              // defaultValue=""
              rules={{ required: 'Device is required' }}
              render={({ field }) => (
                <><Select
                  label="Select Device"
                  variant="outlined"
                  {...field}
                  error={!!errors.deviceId}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 105
                      },
                    },
                  }}
                >
                  {deviceList.map((device) => (
                    <MenuItem sx={{ justifyContent: 'center' }} key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.deviceId?.message}</FormHelperText>
                </>

              )} />
          </FormControl>
          {/* <Controller
            name="deviceKey"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                type="text"
                {...field}
                label="device Key"
                variant="outlined"
                sx={{ m: 1, width: 300 }}
                error={!!errors.deviceKey}
                helperText={errors.deviceKey?.message}
              />
            )}
          />
          <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
            <InputLabel>Type</InputLabel>
            <Controller
              name="type"
              control={control}
              // defaultValue=""

              render={({ field }) => (
                <Select {...field} label="Type" error={!!errors.type}>
                  
                  <MenuItem value="MONITORING">Monitoring</MenuItem>
                  <MenuItem value="CONTROL">Control</MenuItem>
                </Select>
              )}
            />
          </FormControl> */}

          <Box m={2}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit" className={styles['update_modal-buttons']} >
               Add
            </Button>
            <Button variant="contained" color="secondary" onClick={()=>{onClose(); reset()}} className={styles['update_modal-buttons']}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default AddDeviceComponent;
