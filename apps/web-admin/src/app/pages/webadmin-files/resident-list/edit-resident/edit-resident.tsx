/* eslint-disable react/jsx-no-useless-fragment */
import styles from './edit-resident.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { AddFlat, AddResident, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';


export interface EditResidentProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddResident) => void;
  initialData: AddResident | null;
}

const EditResidentComponent: React.FC<EditResidentProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().min(10).required('Phone number is required'),
    isChild: yup.boolean().required('Please Select Option'),
    type: yup.string().required('Please Select Option'),
    flatId: yup.string().required('FlatId is required'),
    // isActive:yup.boolean().required()
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<AddResident>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      // setValue('floorId', String(initialData.floorId));
      setValue('flatId', initialData.flatId);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: AddResident) => {
    // data.flatId = parseInt(data.flatId);
    onUpdate(data);
    reset();
  };

  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  // const [floorNumber, setFloorNumber] = useState<string>('');
  // const [buildingName, setBuildingName] = useState<string>('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  // const [showAddFlatForm, setShowAddFlatForm] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  // const [flatNumber, setFlatNumber] = useState<string>('');


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

  const getAllFlats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/flats`, {
        withCredentials: true,
        params: {
          pageSize: totalFlatValue,
        }
      });
      console.log(response.data);
      const { content, total } = response.data;
      setFlatList(content);
      setTotalFlatValue(total);

      const flats = response.data.content;
      const activeFlats = flats.filter(
        (flat: {
          id: number;
          number: string;
          isActive: boolean;
        }) => flat.isActive === true
      );
      console.log("Floor", response.data);
      console.log("Floor", activeFlats.flat.buildingId);
      setFlatList(activeFlats);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };


  useEffect(() => {
    getAllBuildings();
    getAllFloors();
    getAllFlats();
  }, [page, rowsPerPage, totalbuildingValue, totalFlatValue, totalValue]);


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Edit Resident Name</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Resident Name"
                    // {...register('name')}
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    type="email"
                    className="form-control"
                    placeholder="Enter new Resident Email"
                    // {...register('email')}
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ marginTop: "13px" }}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{ required: 'Phone Number is required' }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    className="form-control"
                    placeholder="Enter new Resident Phone Number"
                    // {...register('phoneNumber')}
                    {...field}
                    label="Phone Number"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{ marginTop: "15px" }}
                  />
                )}
              />
              <FormControl sx={{ width: 260 }}>
                <InputLabel sx={{ marginTop: "15px" }} htmlFor="resident">Resident Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  // defaultValue=""
                  rules={{ required: 'Resident Type is required' }}
                  render={({ field }) => (
                    <Select
                      label="Resident Type"
                      variant="outlined"
                      // {...register('type')}
                      {...field}
                      error={!!errors.type}
                      sx={{ marginTop: "15px", justifyContent: 'center' }}


                    >
                      <FormHelperText>{errors.type?.message}</FormHelperText>
                      <MenuItem value="FAMILY_MEMBER" >Owner Family Member</MenuItem>
                      <MenuItem value="OWNER">Owner</MenuItem>
                      <MenuItem value="TENANT">Tenant</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
            <Box className={styles['modal_second_container']} sx={{ mb: "15px", mt: "15px" }}>
              <FormControl sx={{ display: "flex", flexDirection: "row" }}>
                <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px", ml: "10px", paddingBottom: "20px" }}>Are You Child? </FormLabel>
                <Controller
                  name="isChild"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} sx={{ display: "flex", flexDirection: "row", ml: "2px", paddingBottom: "12px" }}>
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

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
                  {buildingList.map((building) => (
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
                    <Select
                      label="Select Floor"
                      variant="outlined"
                      value={selectedFloorId || ''}
                      onChange={(event) => {
                        setSelectedFloorId(event.target.value as number);
                      }}
                    >
                      {floorList
                        .filter((floor) => selectedBuildingId === null || floor.building.id === selectedBuildingId)
                        .map((floor) => (
                          <MenuItem sx={{ justifyContent: 'center' }} key={floor.id} value={floor.id}>
                            {floor.number}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="floor">Select Floor</InputLabel>
                    <Select label="Select Floor" variant="outlined">
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select">
                        Please Select Building
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>

              <FormControl sx={{ m: 1, width: 260 }}>
                {selectedFloorId ? (
                  <>
                    <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                      <InputLabel htmlFor="flat">Select Flat</InputLabel>
                      <Controller
                        name="flatId"
                        control={control}
                        // defaultValue=""
                        rules={{ required: 'Flat Id is required' }}
                        render={({ field }) => (
                          <Select
                            label="Select Flat"
                            variant="outlined"
                            error={!!errors.flatId}
                            // value={selectedFlatId || ''}
                            // onChange={(event) => {
                            //   setSelectedFloorId(event.target.value as number);
                            // }}
                            // {...register('flatId')}
                            {...field}
                            fullWidth
                          >
                            {flatList
                              .filter((flat) => selectedFloorId === null || flat.floor.id === selectedFloorId)
                              .map((flat) => (
                                <MenuItem sx={{ justifyContent: 'center' }} key={flat.id} value={flat.id}>
                                  {flat.number}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="flat">Select Flat</InputLabel>
                    <Select label="Select Flat" variant="outlined" fullWidth>
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select">
                        Please Select Floor
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>
            </Box>
          </Box>
          <Box className={styles['update_modal-buttons']}>
            <Button className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Edit
            </Button>
            <Button variant="contained" color="inherit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form >
      </Box >
    </Modal >
  );
}

export default EditResidentComponent;
