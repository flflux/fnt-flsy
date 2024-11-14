/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext, useEffect, useState } from 'react';
import styles from './add-flat-vehicle.module.scss';
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
import { Dialog, FormHelperText } from '@mui/material';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

interface AddFlatVehicleProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
  initialData: ViewFlat | null;
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

interface ViewVehicle {
  id: number;
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



const AddFlatVehicleComponent: React.FC<AddFlatVehicleProps> = ({ open, onClose, onSubmit, initialData }) => {
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
    type: yup.string().required('Please Select Type Option'),
    number: yup.string().matches(/^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-HJ-NP-Z]{1,2}$/, 'Invalid vehicle number').max(10).required('Vehicle Number is required'),
    flatId: yup.number().required('flatNumber is Required'),
    floorId: yup.number().required('Floor Number is Required'),
    buildingId:yup.number().required('Building Id is required'),
    isActive:yup.boolean().required('Status is required')
  });

  const { handleSubmit, control,  formState: { errors }, setValue, watch, reset } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    }
  });

  const selectedBuildingId = watch('buildingId');
  const selectedFloorId = watch('floorId');
  
  const initialBuildingId = initialData?.floor.building.id ?? null;
  const initialFloorId = initialData?.floor.id ?? null;
  const initialFlatId = initialData?.id ?? null;

  const societycontext=useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  const handleFormSubmit = (data: Form) => {
    setValue('buildingId', initialBuildingId || 0);
    setValue('floorId', initialFloorId || 0);
    setValue('flatId', initialFlatId || 0);
    onSubmit(data);
  };
  


  useEffect(() => {
    if (initialData ) {
      setValue('buildingId', initialData?.floor.building.id);
      setValue('floorId', initialData?.floor.id);
      setValue('flatId', initialData?.id);
    }
  }, [initialData, setValue, user, societycontext]);



  





  const getAllBuildings = async () => {
    try {
      console.log("GET BLDG", `${apiUrl}/societies/${societycontext?.id}/buildings`)
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
      console.log('Error in fetching all Buildings in Add modal:', error);
    }
  };

  const getAllFloors = async () => {
    try {
      console.log("GET FLOORS ", `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors`)
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
      console.log("GET FLAT", `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/flats`)
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/flats`, {
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
      setFlatList(flats);
    } catch (error) {
      console.log('Error in fecthing flats in add Modal:', error);
    }
  };


  useEffect(() => {
    console.log("societycontext ",societycontext);
    if(societycontext) {
      getAllBuildings();
      getAllFloors();
      getAllFlats();
    }
   
  }, [page, rowsPerPage, totalbuildingValue, totalFlatValue, totalValue, selectedBuildingId, selectedFloorId, user, societycontext]);

  // useEffect(() => { 
  //   getAllFloors();
  // }, [selectedBuildingId]);

  // useEffect(() => { 
  //   getAllFlats();
  // }, [selectedFloorId]);


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

  const handleCancel = () => {
    reset();
    setValue('buildingId', initialBuildingId || 0);
    setValue('floorId', initialFloorId || 0);
    setValue('flatId', initialFlatId || 0);
    onClose()
  };

  useEffect(() => {
    if (open) {
      reset();
      getAllBuildings();
      setValue('buildingId', initialBuildingId || 0);
      setValue('floorId', initialFloorId || 0);
      setValue('flatId', initialFlatId || 0);
    }
  }, [open, reset]);
  
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Vehicle</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 1,
            paddingRight:3,
            paddingLeft:3,
            gridTemplateColumns: 'repeat(2, 1fr)',
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr', 
            },
          }}>
            <Box className={styles['modal_first_container']}>
            <Box className={styles['grid_top']}>
              <FormControl sx={{  width: '100%' }}>
                {showAddForm ? (
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <TextField
                          type="text"
                          className="form-control"
                          placeholder="Enter Building Name"
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
                    <InputLabel htmlFor="building">Building*</InputLabel>
                    <Controller
                      name="buildingId"
                      control={control}
                      // defaultValue=""
                      rules={{ required: 'Building Id is required' }}
                      render={({ field }) => (
                        <Select
                          label="Building*"
                          variant="outlined"
                          // {...register('buildingId')}
                          {...field}
                          fullWidth
                          disabled
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
                        //  <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddForm(true)} /> 
                      )}
                    />
                  </Box>
                )}
              </FormControl>
              </Box>
              <Box className={styles['grid_top']}>
              <FormControl sx={{  width: '100%' }}>
                {selectedBuildingId ? (
                  <>
                    {showAddFloorForm ? (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter Floor Number"
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
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <InputLabel htmlFor="floor">Floor*</InputLabel>
                        <Controller
                          name="floorId"
                          control={control}
                          // defaultValue=""
                          rules={{ required: 'Floor Id is required' }}
                          render={({ field }) => (
                            <Select
                              label="Floor*"
                              variant="outlined"
                              {...field}
                              // {...register('floorId')}
                              error={!!errors.floorId}
                              fullWidth
                              disabled
                              
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
                            //  <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFloorForm(true)} /> 
                          )}
                        />
                      </Box>

                    )}
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="floor">Floor*</InputLabel>
                    <Select
                      label="Floor*"
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
              </Box>
              <Box className={styles['grid_top']}>
              <FormControl sx={{  width: '100%' }}>
                {selectedFloorId ? (
                  <>
                    {showAddFlatForm ? (
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                            <TextField
                              type="text"
                              className="form-control"
                              placeholder="Enter Flat Number"
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
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>

                        <InputLabel htmlFor="flat">Flat*</InputLabel>
                        <Controller
                          name="flatId"
                          control={control}
                          // defaultValue=""
                          rules={{ required: 'Flat Id is required' }}
                          render={({ field }) => (
                            <Select
                              // {...register('flatId')}
                              {...field}
                              label="Flat*"
                              variant="outlined"
                              error={!!errors.flatId}
                              fullWidth
                              disabled
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
                            // <AddIcon sx={{ marginTop: '15px' }} onClick={() => setShowAddFlatForm(true)} />
                          )}
                        />
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="flat">Flat*</InputLabel>
                    <Select
                      label="Flat*"
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
                    sx={{  width: '100%' }}
                  />
                )}
              />
              </Box>
              <Box className={styles['grid_top']}>
              <Controller
                name="number"
                control={control}
                defaultValue=""
                // rules={{ required: 'Vehicle Number is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    label="Vehicle Number*"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    sx={{  width: '100%' }}
                    
                  />
                )}
              />
              </Box>
              <Box className={styles['grid_top']}>
              <FormControl sx={{  width: '100%' }}>
                <InputLabel id="resident" htmlFor="resident">Vehicle Type*</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Vehicle Type is required' }}
                  render={({ field }) => (
                    <Select
                      id="resident"
                      label="Vehicle Type*"
                      variant='outlined'
                      {...field}
                      error={!!errors.type}
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
                 <FormHelperText sx={{ color:"#d32f2f"}}>{errors.type?.message}</FormHelperText>
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddFlatVehicleComponent;
