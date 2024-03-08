import styles from './edit-floors.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddFloor, Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { useParams } from 'react-router-dom';


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

  const params=useParams();

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

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number);
      setValue('buildingId', initialData.building.id);
    }
  }, [initialData, setValue]);

  const initialBuildingId = initialData?.building.id ?? null;

  const handleUpdate = (data: Form) => {
    setValue('buildingId', initialBuildingId || 0);
    onUpdate(data);
    onClose();
  };


  const handleCancel = () => {
    reset();
    setValue('buildingId', initialBuildingId || 0);
    onClose()
  };

  const getAllBuildings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings`, {
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
  }, [page, rowsPerPage, totalbuildingValue, totalFloorValue, totalValue]);


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Edit Floor</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <FormControl sx={{ m: 1, width: 260 }}>
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
                sx={{ margin: "10px" }}
              />
            )}
          />
          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => {onClose(); handleCancel()}}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditFloorComponent;
