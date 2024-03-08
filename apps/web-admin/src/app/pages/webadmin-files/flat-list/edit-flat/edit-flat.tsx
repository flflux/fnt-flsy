import styles from './edit-flat.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddFlat, Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';


export interface EditFlatProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddFlat) => void;
  initialData: AddFlat | null;
}

const EditFlatComponent: React.FC<EditFlatProps> = ({ open, onClose, onUpdate, initialData }) => {
  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  // const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  // const [showAddFlatForm, setShowAddFlatForm] = useState(false);
  // const [floorNumber, setFloorNumber] = useState<string>('');
  // const [flatNumber, setFlatNumber] = useState<string>('');
  // const [buildingName, setBuildingName] = useState<string>('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  // const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

  
  const validationSchema = yup.object().shape({
    number: yup.string().required('Vehicle Number is required'),
    floorId: yup.number().required('flatNumber is Required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddFlat>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number);
      // setValue('floorId', String(initialData.floor.number));
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: AddFlat) => {
    onUpdate(data);
    onClose();
  };

  
  const getAllBuildings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/1/buildings`, {
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
      const activeBuildings = buildings.filter(
        (building: {
          id: number;
          name: string;
          isActive: boolean;
          society: { id: number };
        }) => building.isActive === true
      );
      console.log(response.data);
      setBuildingList(activeBuildings);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };

  const getAllFloors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/floors`, {
        withCredentials: true,
        params: {
          pageSize: totalValue,
        }
      });
      console.log(response.data);
      const { content, total } = response.data;
      setFloorList(content);
      setTotalValue(total);

      const floors = response.data.content;
      const activeFloors = floors.filter(
        (floor: {
          id: number;
          number: string;
          isActive: boolean;
          buildingId: number
        }) => floor.isActive === true
      );
      console.log("Floor", response.data);
      console.log("Floor", activeFloors.floor.buildingId);
      setFloorList(activeFloors);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };


  useEffect(() => {
    getAllBuildings();
    getAllFloors();
  }, [page, rowsPerPage, totalbuildingValue, totalFlatValue, totalValue]);


  return (
    <Modal open={open} onClose={onClose}>
          <Box className={styles['modal-container']}>
            <h2>Edit Flat Name</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <FormControl sx={{ m: 1, width: 260 }}>
                <InputLabel htmlFor="building">Select Building</InputLabel>
                <Select
                  label="Select Building"
                  variant="outlined"
                  value={selectedBuildingId || ''}
                  onChange={(event) => {
                    setSelectedBuildingId(event.target.value as number);
                  }}
                >
                  {buildingList.map((building: Building) => (
                    <MenuItem sx={{ justifyContent: 'center' }} key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
              <FormControl sx={{ m: 1, width: 260 }}>
                {selectedBuildingId ? (
                  <>
                    <InputLabel htmlFor="floor">Select Floor</InputLabel>
                    <Controller
                      name="floorId"
                      control={control}
                      // defaultValue=""
                      rules={{ required: 'Flat Number is required' }}
                      render={({ field }) => (
                        <Select
                          // {...register('FloorNum')}
                          {...field}
                          label="Select Floor"
                          variant="outlined"
                          error={!!errors.floorId}
                        >
                          {floorList
                            .filter((floor: ViewFloor) => {
                              return selectedBuildingId === null || floor.building.id === selectedBuildingId;
                            })
                            .map((floor: ViewFloor) => (
                              <MenuItem sx={{ justifyContent: 'center' }} key={floor.id} value={floor.id}>
                                {floor.number}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="floor">Select Floor</InputLabel>
                    <Select
                      label="Select Floor"
                      variant="outlined"
                    >
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                        Please Select Building
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>
              <Controller
                name="number"
                control={control}
                defaultValue=""
                rules={{ required: 'Flat Number is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    label="New Flat Number"
                    variant="outlined"
                    size="medium"
                    // {...register('FlatNum')}
                    {...field}
                    // error={!!errors.FlatNum}
                    // helperText={errors.FlatNum?.message}
                    sx={{ margin: "10px" }}
                  />
                )}
              />
              <Box className={styles['update_modal-buttons']}>
                <Button sx={{mr:"10px"}} className={styles['edit_button']} variant="contained" color="primary" type="submit" >
                  Edit
                </Button>
                <Button variant="contained" color="inherit" onClick={() => onClose()}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
  );
}

export default EditFlatComponent;
