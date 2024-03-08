import styles from './edit-fl-admin.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface EditFLAdminProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddFLuser) => void;
  initialData: FLUser | null;
}


interface FLUser {
  id: number;
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

interface AddFLuser {
  superRole: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export function EditFLAdmin({ open, onClose, onUpdate, initialData }: EditFLAdminProps) {
  const validationSchema = yup.object().shape({
    superRole: yup.string().required('Please Select One'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<AddFLuser>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('firstName', initialData.firstName);
      setValue('lastName', initialData.lastName);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue("superRole", initialData.superRole)
    }
  }, [initialData, setValue]);



  const handleUpdate = (data: AddFLuser) => {
    console.log("on update", data);
    onUpdate(data);
    onClose();
    reset();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit User</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Box className={styles['modal_second_container']}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin First Name is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="First Name"
                  variant="outlined"
                  size="medium"
                  {...field}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{ margin: '10px' }}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Last Name is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Last Name"
                  variant="outlined"
                  size="medium"
                  {...field}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{ margin: '10px' }}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Email is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Email"
                  variant="outlined"
                  size="medium"
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ margin: '10px' }}
                  disabled
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{ required: 'Admin Phone Number is required' }}
              render={({ field }) => (
                <TextField
                  type="text"
                  label="Phone Number"
                  variant="outlined"
                  size="medium"
                  {...field}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  sx={{ margin: '10px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment sx={{mt:"1px"}} position="start">
                        +91
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <FormControl sx={{ width: 340, m: "10px" }} error={!!errors.superRole}>
              <InputLabel htmlFor="type"  >Role*</InputLabel>
              <Controller
                name="superRole"
                control={control}
                defaultValue={"ADMIN"}
                rules={{ required: 'SuperRole Name is Required' }}
                render={({ field }) => (
                  <Select
                    label="Role*"
                    variant="outlined"
                    {...field}
                    error={!!errors.superRole}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 97
                        },
                      },
                    }}
                  >
                    <MenuItem sx={{ justifyContent: "start" }} value="ADMIN">ADMIN</MenuItem>
                    {/* <MenuItem sx={{ justifyContent: "start" }} value="USER">USER</MenuItem> */}
                  </Select>
                )}
              />
              <FormHelperText>{errors.superRole?.message}</FormHelperText>
            </FormControl>



          </Box>

          <Box sx={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: "10px" }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => { onClose(); reset() }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal >
  );
}

export default EditFLAdmin;
