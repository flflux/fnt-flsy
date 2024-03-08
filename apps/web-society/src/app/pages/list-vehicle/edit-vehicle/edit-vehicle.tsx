import styles from './edit-vehicle.module.scss';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { EditVehicle } from '@fnt-flsy/data-transfer-types';
import { Dialog, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { VehicleType } from '@prisma/client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// type EditVehicleDataOrNull = EditVehicle | null;


interface EditVehicleProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: ViewVehicle) => void;
  initialData: ViewVehicle | null;
}

interface Form{
  name:string;
  number:string;
  type:string;
  isActive:boolean;
}


interface ViewVehicle {
  id:number;
  name: string;
  number: string;
  type: string;
  isActive: boolean;
  flats: [
    {
      flats: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: {
              id: number;
              name: string
            };
          }
        }
      }
    }];

}


const EditVehicleComponent: React.FC<EditVehicleProps> = ({ open, onClose, onUpdate, initialData }) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    number:yup.string().matches(/^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-HJ-NP-Z]{1,2}$/, 'Invalid vehicle number').max(10).required('Number is  required'),
    type: yup.string().required('Please Select Option'),
    isActive:yup.boolean().required('Status is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ViewVehicle>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('number',initialData.number);
      setValue('type', initialData.type);
    }
  }, [initialData, setValue]);

  const initialVehicleName = initialData?.name ?? null;
  const initialVehicleNumber = initialData?.number ?? null;
  const initialVehicleType = initialData?.type ?? null;

  const handleUpdate = (data: ViewVehicle) => {
    console.log("on update", data);
    onUpdate(data);
    setValue('name', initialVehicleName ?? null as unknown as string);
    setValue('number', initialVehicleNumber ?? null as unknown as string);
    setValue('type', initialVehicleType ?? null as unknown as string);

    onClose();
    reset();
  };

  const handleCancel = () => {
    reset();
    setValue('name', initialVehicleName ?? null as unknown as string);
    setValue('number', initialVehicleNumber ?? null as unknown as string);
    setValue('type', initialVehicleType ?? null as unknown as string);
    onClose()
  };
console.log(errors);
  return (
    <Dialog open={open} onClose={onClose}>
      <Box className={styles['edit_modal_container']}>
        <h2 className={styles['h2_tag']}>Edit Vehicle</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
        <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: ' Vehicle Name is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Vehicle  Number*"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.number}
                helperText={errors.number?.message}
                sx={{ margin: "10px", width: '70%' }}
                disabled
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: ' Vehicle Name is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Vehicle Name*"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ margin: "10px", width: '70%' }}
              />
            )}
          />
          <FormControl sx={{ m: 1, width: '70%' }}>
            <InputLabel id="my-select">Type*</InputLabel>
            <Controller
              name="type"
              control={control}
              // defaultValue=""
              rules={{ required: 'Vehicle Type is required' }}
              render={({ field }) => (
                <Select
                  labelId='my-select'
                  id="my-select"
                  label="Type*"
                  {...field}
                  error={!!errors.type}
                  variant='outlined'
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 90
                      },
                    },
                  }}
                >
                  <MenuItem sx={{justifyContent:"start"}} value="TWO_WHEELER">Two Wheeler</MenuItem>
                  <MenuItem sx={{justifyContent:"start"}} value="FOUR_WHEELER">Four Wheeler</MenuItem>
                  <MenuItem sx={{justifyContent:"start"}} value="OTHER">Other</MenuItem>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </Select>
              )}
            />
          </FormControl>
          <Box sx={{ mt: "10px" }}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditVehicleComponent;
