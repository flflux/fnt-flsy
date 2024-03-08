import styles from './edit-floors.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddFloor, Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { Dialog, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

export interface EditFloorProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: ViewFloor | null;
}

interface Form {
  buildingId: number;
  number: string;
}
const EditFloorComponent: React.FC<EditFloorProps> = ({ open, onClose, onUpdate, initialData }) => {
  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFloorValue, setTotalFloorValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user=useContext(UserContext);


  const validationSchema = yup.object().shape({
    number: yup.string().required('Floor Number is required'),
    buildingId: yup.number().required('Building Id is Required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
    }
  });

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number);
      setValue('buildingId', initialData.building.id);
    }
  }, [initialData, setValue, user, societycontext]);

  

  const handleUpdate = (data: Form) => {
    onUpdate(data);
    onClose();
    reset();
  };


  const getAllBuildings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings`, {
        withCredentials: true,
        params: {
          pageSize: totalbuildingValue,
        }
      });
      console.log(response.data);
      const { content, total } = response.data;
      setBuildingList(content);
      setTotalbuildingValue(total);

      const buildings = response.data.content;
      console.log(response.data);
      setBuildingList(buildings);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };

  useEffect(() => {
    getAllBuildings();
  }, [page, rowsPerPage, totalbuildingValue, totalFloorValue, totalValue, user, societycontext]);


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Floor</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <FormControl className={styles['form-inputs-control']} >
            <InputLabel htmlFor="building">Building*</InputLabel>
            <Controller
              name="buildingId"
              control={control}
              // defaultValue=""
              rules={{ required: 'Building Name is required' }}
              render={({ field }) => (
                <Select
                  label="Building*"
                  variant="outlined"
                  {...field}
                  disabled
                >
                  {buildingList.map((building: Building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              )} />
          </FormControl>
          <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: 'Floor Number is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Floor Number*"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.number}
                helperText={errors.number?.message}
                sx={{ marginTop: "15px" }}
                className={styles['form-inputs-control']}
              />
            )}
          />
          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => {onClose(); reset()}}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditFloorComponent;
