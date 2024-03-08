/* eslint-disable react/jsx-no-useless-fragment */
import styles from './add-resident.module.scss';
import React, { useEffect, useState } from 'react';
// import styles from './add-flat.module.scss';
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
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup } from '@mui/material';


export interface AddResidentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddResident) => void;
}

const AddResidentComponent: React.FC<AddResidentProps> = ({ open, onClose, onSubmit }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().min(10).required('Phone number is required'),
    isChild: yup.boolean().required('Please Select Option'),
    type: yup.string().required('Please Select Option'),
    flatId: yup.string().required('FlatId is required'),
    // isActive:yup.boolean().required()
  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<AddResident>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  const handleFormSubmit = (data: AddResident) => {
    data.flatId = data.flatId as number;
    onSubmit(data);
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  const [floorNumber, setFloorNumber] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  const [showAddFlatForm, setShowAddFlatForm] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [flatNumber, setFlatNumber] = useState<string>('');
  

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



  const handleOnAddBuildingSubmit = async () => {

    try {
      const newData = {
        name: buildingName,
        societyId: 1,
        isActive: true,
      };
      const { data } = await axios.post(
        `${apiUrl}/societies/1/buildings`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllBuildings();
        setShowAddForm(false);

        console.log("data is given", data)

      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
    }
  };

  const handleOnAddFloorSubmit = async () => {

    try {
      const newData = {
        number: floorNumber,
        buildingId: selectedBuildingId,
        isActive: true,
      };
      const { data } = await axios.post(
        `${apiUrl}/floors`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllFloors();
        setShowAddFloorForm(false);

        console.log("data is given", data)

      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
    }
  };

  
  const handleOnAddFlatSubmit = async () => {

    try {
      const newData = {
        number: flatNumber,
        floorId: selectedFloorId,
        isActive: true,
      };
      const { data } = await axios.post(
        `${apiUrl}/flats`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllFlats();
        setShowAddFlatForm(false);

        console.log("data is given", data)

      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
    <Box className={styles['modal-container']}>
      <h2>Add New Resident</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container xs={11}
        // className={styles['modal_form_containers']}
        >
          <Grid container className={styles['modal_first_container']}>
            <Grid xs={6}>
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
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  // sx={{ marginTop: "5px" }}
                  />
                )}
              />
            </Grid>
            <Grid xs={6}>
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
                  // sx={{ marginTop: "13px" }}
                  />
                )}
              />
            </Grid>
            <Grid xs={6}>
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
                    sx={{ marginTop: "14px" }}
                  />
                )}
              />
            </Grid>
            <Grid xs={6}>
              <FormControl sx={{ width: 260 }}>
                <InputLabel sx={{ marginTop: "15px" }} htmlFor="type">Resident Type</InputLabel>
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
                      sx={{ marginTop: "16px" ,justifyContent: 'center'}}
                    >
                      <FormHelperText>{errors.type?.message}</FormHelperText>
                      <MenuItem value="FAMILY_MEMBER">Owner Family Member</MenuItem>
                      <MenuItem value="OWNER">Owner</MenuItem>
                      <MenuItem value="TENANT">Tenant</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container
          // className={styles['modal_second_container']}
          >
            <Grid xs={6}>
              <FormControl sx={{ display: "flex", flexDirection: "row", mt: "20px", ml: "6px" }}>
                <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px", mr: "5px" }}>Are You Child?</FormLabel>
                <Controller
                  name="isChild"
                  control={control}
                  // defaultValue={false}
                  render={({ field }) => (
                    <RadioGroup {...field} sx={{ display: "flex", flexDirection: "row" }}>
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
            </Grid>
            <Grid xs={6}>
              <FormControl sx={{ mt: 2, width: 260 }}>
                {showAddForm ? (
                  <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <TextField
                          type="text"
                          className="form-control"
                          placeholder="Enter new Building Name"
                          // value={buildingName}
                          onChange={(event) => {
                            setBuildingName(event.target.value as string);
                          }}
                        // error={!!errors.name}
                        // helperText={errors.name?.message}
                        />
                        <Grid className={styles['update_modal-buttons']}>
                          <DoneIcon sx={{marginTop:"15px"}} onClick={() => {
                            handleOnAddBuildingSubmit();
                          }}>
                          </DoneIcon>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <InputLabel htmlFor="building">Select Building</InputLabel>
                    <Select
                      label="Select Building"
                      variant="outlined"
                      value={selectedBuildingId || ''}
                      onChange={(event) => {
                        setSelectedBuildingId(event.target.value as number);
                      }}
                      fullWidth
                    >
                      {buildingList.map((building: Building) => (
                        <MenuItem sx={{ justifyContent: 'center' }} key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddForm(true)} />
                  </Grid>
                )}
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ mt: 1, ml: 1.7, width: 254 }}>
                {selectedBuildingId ? (
                  <>
                    {showAddFloorForm ? (
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter new Floor Number"
                              // value={floorNumber}
                              onChange={(event) => {
                                setFloorNumber(event.target.value as string);
                              }}

                            />

                            <Grid className={styles['update_modal-buttons']}>
                              <DoneIcon sx={{marginTop:"15px"}}  onClick={() => {
                                handleOnAddFloorSubmit();
                              }} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <InputLabel htmlFor="floor">Select Floor</InputLabel>
                        <Select
                          value={selectedFloorId || ''}
                          label="Select Floor"
                          variant="outlined"
                          // error={!!errors.FloorNum}
                          fullWidth
                          onChange={(event) => {
                            setSelectedFloorId(event.target.value as number);
                          }}
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
                        <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFloorForm(true)} />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="floor">Select Floor</InputLabel>
                    <Select
                      label="Select Floor"
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                        Please Select Building
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ m: 1, ml: 1.7, width: 260 }}>
                {selectedFloorId ? (
                  <>
                    {showAddFlatForm ? (
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter new Flat Number"
                              //  value={flatNumber}
                              onChange={(event) => {
                                setFlatNumber(event.target.value as string);
                              }}

                            />

                            <Grid className={styles['update_modal-buttons']}>
                              <DoneIcon onClick={() => {
                                handleOnAddFlatSubmit();
                              }} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>

                        <InputLabel htmlFor="flat">Select Flat</InputLabel>
                        <Controller
                          name="flatId"
                          control={control}
                          // defaultValue=""
                          rules={{ required: 'Flat Id is required' }}
                          render={({ field }) => (
                            <Select
                              // {...register('flatId')}
                              {...field}
                              label="Select Flat"
                              variant="outlined"
                              error={!!errors.flatId}
                              fullWidth
                            >
                              {flatList
                                .filter((flat: ViewFlat) => {
                                  return selectedFloorId === null || flat.floor.id === selectedFloorId;

                                })
                                .map((flat: ViewFlat) => (
                                  <MenuItem sx={{ justifyContent: 'center' }} key={flat.id} value={flat.id}>
                                    {flat.number}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFlatForm(true)} />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="flat">Select Flat</InputLabel>
                    <Select
                      label="Select Flat"
                      variant="outlined"
                    >
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                        Please Select Floor
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid className={styles['update_modal-buttons']}>
          <Button sx={{mr:"10px"}} variant="contained" color="primary" type="submit">
            + Add
          </Button>
          <Button variant="contained" color='inherit' onClick={onClose}>
            Cancel
          </Button>
        </Grid>
      </form>

    </Box>
  </Modal>
  );
}

export default AddResidentComponent;
