/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext, useEffect, useState } from 'react';
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
import { FormHelperText } from '@mui/material';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

interface AddVehicleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

interface Form {
  buildingId: number;
  floorId: number;
  flatId: number;
  number: string;
  name: string;
  type: string;
  isActive: boolean;
}

const AddVehicleComponent: React.FC<AddVehicleProps> = ({ open, onClose, onSubmit }) => {
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
  const user=useContext(UserContext);


  const validationSchema = yup.object().shape({
    name: yup.string().required('Vehicle Name is required'),
    type: yup.string().typeError('Please Select Type Option').required('Please Select Option'),
    number: yup.string().required('Vehicle Number is required'),
    flatId: yup.number().typeError('Flat is required').required('Flat is Required'),
    floorId: yup.number().typeError('Floor is required').required('Floor is Required'),
    buildingId: yup.number().typeError('Building is required').required('Building  is required'),
    isActive: yup.boolean().required('Status is required')
  });
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    }
  });

  const selectedBuildingId = watch('buildingId');
  const selectedFloorId = watch('floorId');


  const handleFormSubmit = (data: Form) => {
    onSubmit(data);
    reset();
  };

  const societycontext=useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  // const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  // const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

  useEffect(() => {
    getAllBuildings();
    getAllFloors();
    getAllFlats();
  }, [page, rowsPerPage, totalbuildingValue, totalFlatValue, totalValue, user, societycontext]);

  useEffect(() => {
    getAllFloors();
  }, [selectedBuildingId, user, societycontext]);

  useEffect(() => {
    getAllFlats();
  }, [selectedFloorId, user, societycontext]);

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
      const activeBuildings = buildings.filter(
        (building: {
          id: number;
          name: string;
          isActive: boolean;
          society: { id: any };
        }) => building.isActive === true
      );
      console.log(response.data);
      setBuildingList(buildings);
    } catch (error) {
      console.log('Error in fetching all Buildings in Add modal:', error);
    }
  };

  const getAllFloors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors`, {
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
      console.log("Floor", response.data);
      setFloorList(floors);
    } catch (error) {
      console.log('Error in fecthing Floors in add Modal:', error);
    }
  };

  const getAllFlats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors/${selectedFloorId}/flats`, {
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
      setFlatList(flats);
    } catch (error) {
      console.log('Error in fecthing flats in add Modal:', error);
    }
  };


  


  const handleOnAddBuildingSubmit = async () => {

    try {
      const newData = {
        name: buildingName,
        societyId: 1,
        isActive: true,
      };
      const { data } = await axios.post(
        `${apiUrl}/societies/${societycontext?.id}/buildings`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllBuildings();
        setShowAddForm(false);

        console.log("Building data is given", data);

      } else {
        console.log('Something went wrong in Building Data');
      }
    } catch (error) {
      console.log('Erorr in Submiting building in add modal:', error);
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
        `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllFloors();
        setShowAddFloorForm(false);

        console.log("Floor data is given", data)

      } else {
        console.log('Something went wrong in Floor data');
      }
    } catch (error) {
      console.log('Erorr in Submiting floors in add modal:', error);
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
        `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors/${selectedFloorId}/flats`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        getAllFlats();
        setShowAddFlatForm(false);

        console.log("Flats data is given", data)

      } else {
        console.log('Something went wrong in Flats data');
      }
    } catch (error) {
      console.log('Erorr in Submiting Flats in add modal:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Vehicle</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{
            display: 'grid',
            columnGap: 1,
            rowGap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}>
            <Box className={styles['modal_first_container']}>
              <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
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
                            <DoneIcon sx={{ marginTop: "15px" }} onClick={() => {
                              handleOnAddBuildingSubmit();
                            }}>
                            </DoneIcon>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                      <InputLabel htmlFor="building">Select Building*</InputLabel>
                      <Controller
                        name="buildingId"
                        control={control}
                        // defaultValue=""
                        rules={{ required: 'Building Id is required' }}
                        render={({ field }) => (
                          <Select
                            label="Select Building*"
                            variant="outlined"
                            {...field}
                            error={!!errors.buildingId}
                            // {...register('buildingId')}
                            // onChange={(event) => {
                            //   setSelectedBuildingId(event.target.value as number);
                            // }}
                            fullWidth
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150
                                },
                              },
                            }}
                          >
                            {buildingList.map((building: Building) => (
                              <MenuItem sx={{ justifyContent: 'start' }} key={building.id} value={building.id}>
                                {building.name}
                              </MenuItem>
                            ))}
                          </Select>
                          // <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddForm(true)} /> 
                        )}
                      />
                    </Box>
                  )}
                  <FormHelperText sx={{ color: "#d32f2f" }}>{errors.buildingId?.message}</FormHelperText>
                </FormControl>
              </Box>
              <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
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
                                <DoneIcon sx={{ marginTop: "15px" }} onClick={() => {
                                  handleOnAddFloorSubmit();
                                }} />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <><Box className={styles['grid_top']} sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                          <InputLabel htmlFor="floor">Select Floor*</InputLabel>
                          <Controller
                            name="floorId"
                            control={control}
                            // defaultValue=""
                            rules={{ required: 'Floor Id is required' }}
                            render={({ field }) => (
                              <Select
                                label="Select Floor*"
                                variant="outlined"
                                // {...register('floorId')}
                                {...field}
                                error={!!errors.floorId}
                                fullWidth
                                // onChange={(event) => {
                                //   setSelectedFloorId(event.target.value as number);
                                // }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150
                                    },
                                  },
                                }}
                              >
                                {floorList
                                  .filter((floor: ViewFloor) => {
                                    return selectedBuildingId === null || floor.building.id === selectedBuildingId;
                                  })
                                  .map((floor: ViewFloor) => (
                                    <MenuItem sx={{ justifyContent: 'start' }} key={floor.id} value={floor.id}>
                                      {floor.number}
                                    </MenuItem>
                                  ))}
                              </Select>
                              // <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFloorForm(true)} />
                            )} />
                        </Box><FormHelperText sx={{ color: "#d32f2f" }}>{errors.floorId?.message}</FormHelperText></>
                      )}
                    </>
                  ) : (
                    <>
                      <InputLabel htmlFor="floor">Select Floor*</InputLabel>
                      <Select
                        label="Select Floor*"
                        variant="outlined"
                        error={!!errors.floorId}
                        fullWidth
                      >
                        <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                          Please Select Building
                        </MenuItem>
                      </Select>
                      <FormHelperText sx={{ color: "#d32f2f" }}>{errors.floorId?.message}</FormHelperText>

                    </>
                  )}
                </FormControl>
              </Box>
              <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
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
                                <DoneIcon sx={{ marginTop: "15px" }} onClick={() => {
                                  handleOnAddFlatSubmit();
                                }} />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <><Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>

                          <InputLabel htmlFor="flat">Select Flat*</InputLabel>
                          <Controller
                            name="flatId"
                            control={control}
                            // defaultValue=""
                            rules={{ required: 'Flat Id is required' }}
                            render={({ field }) => (
                              <Select
                                // {...register('flatId')}
                                {...field}
                                label="Select Flat*"
                                variant="outlined"
                                error={!!errors.flatId}
                                fullWidth
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 90
                                    },
                                  },
                                }}
                              >
                                {flatList
                                  .filter((flat: ViewFlat) => {
                                    return selectedFloorId === null || flat.floor.id === selectedFloorId;

                                  })
                                  .map((flat: ViewFlat) => (
                                    <MenuItem sx={{ justifyContent: 'start' }} key={flat.id} value={flat.id}>
                                      {flat.number}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )} />
                          {/* <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFlatForm(true)} /> */}
                        </Box><FormHelperText sx={{ color: "#d32f2f" }}>{errors.flatId?.message}</FormHelperText></>
                      )}
                    </>
                  ) : (
                    <>
                      <Box>
                        <InputLabel htmlFor="flat">Select Flat*</InputLabel>
                        <Select
                          label="Select Flat*"
                          variant="outlined"
                          error={!!errors.flatId}
                          fullWidth
                        >
                          <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                            Please Select Floor
                          </MenuItem>
                        </Select>
                        <FormHelperText sx={{ color: "#d32f2f" }}>{errors.flatId?.message}</FormHelperText>
                      </Box>
                    </>
                  )}
                </FormControl>
              </Box>
            </Box>
            <Box className={styles['modal_second_container']}>
              <Box className={styles['grid_top']}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vehicle Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="Vehicle Name*"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.name}
                      helperText={errors.name?.message}

                    />
                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <Controller
                  name="number"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Vehicle Number is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="Vehicle Number*"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.number}
                      helperText={errors.number?.message}
                      sx={{mt:"2px"}}
                    />
                  )}
                />
              </Box>
              <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  <InputLabel id="resident" htmlFor="resident">Vehicle Type*</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Vehicle Type is required' }}
                    render={({ field }) => (
                      <Select
                        // labelId="Resident Type"
                        id="resident"
                        label="Vehicle Type*"
                        variant='outlined'
                        {...field}
                        error={!!errors.type}
                        // helperText={errors.type?.message}
                        // native={true}
                        sx={{mt:"3px"}}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 90
                            },
                          },
                        }}
                      >
                        <MenuItem sx={{ justifyContent: "start" }} value="TWO_WHEELER" >Two Wheeler</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="FOUR_WHEELER">Four Wheeler</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="OTHER">Other</MenuItem>
                      </Select>

                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{errors.type?.message}</FormHelperText>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: "10px" }}
            >
              Add
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
    </Modal>
  );
};

export default AddVehicleComponent;
