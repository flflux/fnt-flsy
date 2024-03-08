/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import styles from './add-vehicle.module.scss';
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
import { AddVehicle, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface AddVehicleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddVehicle
  ) => void;
}

const AddVehicleComponent: React.FC<AddVehicleProps> = ({ open, onClose, onSubmit }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Please Select Option'),
    number: yup.string().required('Vehicle Number is required'),
    flatId: yup.number().required('flatNumber is Required'),
    isActive: yup.boolean().required()

  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<AddVehicle>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  const handleFormSubmit = (data: AddVehicle) => {
    onSubmit(data);
    reset();
  };

  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  const [showAddFlatForm, setShowAddFlatForm] = useState(false);
  const [floorNumber, setFloorNumber] = useState<string>('');
  const [flatNumber, setFlatNumber] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);


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
          society: { id: any };
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
        <h2>Add New Vehicle</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}>
              <FormControl sx={{ m: 1, width: 260 }}>
                {showAddForm ? (
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <TextField
                          type="text"
                          className="form-control"
                          placeholder="Enter new Building Name"
                          // value={buildingName}
                          onChange={(event) => {
                            setBuildingName(event.target.value as string);
                          }}
                        />
                        <Box className={styles['update_modal-buttons']}>
                          <DoneIcon sx={{marginTop:"15px"}} onClick={() => {
                            handleOnAddBuildingSubmit();
                          }}>
                          </DoneIcon>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <InputLabel htmlFor="building">Select Building</InputLabel>
                    <Select
                      label="Select Building"
                      variant="outlined"
                      // value={selectedBuildingId || ''}
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
                  </Box>
                )}
              </FormControl>
              <FormControl sx={{ m: 1, width: 260 }}>
                {selectedBuildingId ? (
                  <>
                    {showAddFloorForm ? (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter new Floor Number"
                              // value={floorNumber}
                              onChange={(event) => {
                                setFloorNumber(event.target.value as string);
                              }}

                            />

                            <Box className={styles['update_modal-buttons']}>
                              <DoneIcon sx={{marginTop:"15px"}} onClick={() => {
                                handleOnAddFloorSubmit();
                              }} />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <InputLabel htmlFor="floor">Select Floor</InputLabel>
                        <Select
                          // value={selectedFloorId || ''}
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
                      </Box>
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
              <FormControl sx={{ m: 1, width: 260 }}>
                {selectedFloorId ? (
                  <>
                    {showAddFlatForm ? (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter new Flat Number"
                              //  value={flatNumber}
                              onChange={(event) => {
                                setFlatNumber(event.target.value as string);
                              }}
                            />
                            <Box className={styles['update_modal-buttons']}>
                              <DoneIcon  sx={{marginTop:"15px"}} onClick={() => {
                                handleOnAddFlatSubmit();
                              }} />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>

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
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="flat">Select Flat</InputLabel>
                    <Select
                      label="Select Flat"
                      variant="outlined"
                      error={!!errors.flatId}
                    >
                      <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                        Please Select Floor
                      </MenuItem>
                    </Select>
                  </>
                )}
              </FormControl>
            </Box>
            <Box className={styles['modal_second_container']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Vehicle Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    label="Vehicle Name"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ margin: '10px' }}
                  />
                )}
              />
              <Controller
                name="number"
                control={control}
                defaultValue=""
                rules={{ required: 'Vehicle Number is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    label="Vehicle Number"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    sx={{ margin: '10px' }}
                  />
                )}
              />
              <FormControl sx={{ width: 260 }}>
                <InputLabel id="resident" htmlFor="resident">Resident Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Vehicle Type is required' }}
                  render={({ field }) => (
                    <Select
                      // labelId="Resident Type"
                      id="resident"
                      label="Resident Type"
                      variant='outlined'
                      {...field}
                      error={!!errors.type}
                    // helperText={errors.type?.message}
                    // native={true}
                    >
                      <MenuItem value="TWO_WHEELER" >Two Wheeler</MenuItem>
                      <MenuItem value="FOUR_WHEELER">Four Wheeler</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
          </Box>
          <Box sx={{marginTop:"10px"}}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: "10px" }}
            >
              + Add
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddVehicleComponent;
