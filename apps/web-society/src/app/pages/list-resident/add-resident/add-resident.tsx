/* eslint-disable react/jsx-no-useless-fragment */
import styles from './add-resident.module.scss';
import React, { useContext, useEffect, useState } from 'react';
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
import { Building, ViewBuilding, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, Radio, RadioGroup } from '@mui/material';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

export interface AddResidentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
  // initialData: ViewFlat | null;
}

interface Form {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  type: string;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean
}


interface EditForm {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  buildingId: number;
  floorId: number;
  flatId: number;
  isActive: boolean;
  flats: [
    {
      type: string;

      flat: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: { id: number; name: string };
          }
        }
      }
    }]
};


const AddResidentComponent: React.FC<AddResidentProps> = ({ open, onClose, onSubmit }) => {
  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<ViewBuilding[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  const user=useContext(UserContext);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    isChild: yup.boolean().required('Please Select One'),
    isActive: yup.boolean().required('Please Select One'),
    type: yup.string().required('Please Select Option'),
    flatId: yup.number().typeError('Flat is required').required('Flat is required'),
    floorId: yup.number().typeError('Floor is required').required('Floor is required'),
    buildingId: yup.number().typeError('Building is required').required('Building is required'),
  });
  const { register, handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  const selectedBuildingId = watch('buildingId');
  const selectedFloorId = watch('floorId');

  const handleFormSubmit = (data: Form) => {
    console.log("handleAddForm:", data)
    onSubmit(data);
    reset();
  };

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  useEffect(() => {
    getAllBuildings();
    getAllFloors();
    getAllFlats();
  }, [totalbuildingValue, totalFlatValue, totalValue, selectedBuildingId, selectedFloorId, user, societycontext]);

  // useEffect(() => {
  //   if (initialData) {
  //     // setValue('name', initialData.name);
  //     // setValue('email', initialData.email);
  //     // setValue('phoneNumber', initialData.phoneNumber);
  //     // setValue('isChild', initialData.isChild);
  //     // setValue('flats.0.type', initialData.flats[0].type);
  //     setValue('floorId', initialData.floor.id);
  //     setValue('buildingId', initialData.floor.building.id);
  //     setValue('flatId', initialData.id);

  //   }
  // }, [initialData, setValue]);

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

      const Buildings = response.data.content;
      console.log(response.data);
      setBuildingList(Buildings);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
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

      const Floors = response.data.content;
      console.log("Floor", response.data);
      console.log("Floor", Floors.floor.buildingId);
      setFloorList(Floors);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };

  const getAllFlats = async () => {
    try {
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

      const Flats = response.data.content;
      console.log("Floor", response.data);
      console.log("Floor", Flats.flat.buildingId);
      setFlatList(Flats);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };


  


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Resident</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container xs={11}    style={{ margin: 'auto' }}
            className={styles['modal_form_containers']}
          >
            <Grid container className={styles['modal_first_container']}>
            <Grid xs={6} className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <InputLabel htmlFor="building">Select Building</InputLabel>
                    <Controller
                        name="buildingId"
                        control={control}
                        // defaultValue=""
                        rules={{ required: 'Building Id is required' }}
                        render={({ field }) => (
                    <Select
                      label="Select Building"
                      variant="outlined"
                      // {...register('buildingId')}
                      {...field}
                      error={!!errors.buildingId}
                      // value={selectedBuildingId || ''}
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
                        <MenuItem sx={{justifyContent:"start"}} key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </Select>
                    
                    // {/* <FormHelperText>{errors.buildingId?.message}</FormHelperText> */}
                    )}
                      /> 

                  </Grid>
                  <FormHelperText sx={{ color:"#d32f2f"}}>{errors.buildingId?.message}</FormHelperText>

                </FormControl>
              </Grid>
              <Grid xs={6} className={styles['grid_top']} >
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
                      {...field}
                      label="Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                    
                  )}
                />
              </Grid>
              <Grid xs={6} className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  {selectedBuildingId ? (
                    <>
                      <Grid sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <InputLabel htmlFor="floor">Select Floor</InputLabel>
                        <Controller
                            name="floorId"
                            control={control}
                            // defaultValue=""
                            rules={{ required: 'Floor Id is required' }}
                            render={({ field }) => (
                        <Select
                          label="Select Floor"
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
                              <MenuItem sx={{justifyContent:"start"}} key={floor.id} value={floor.id}>
                                {floor.number}
                              </MenuItem>
                            ))}
                        </Select>
                         )}
                          /> 

                      </Grid>
                      <FormHelperText sx={{ color:"#d32f2f"}}>{errors.floorId?.message}</FormHelperText>
                    </>
                  ) : (
                    <>
                      <InputLabel htmlFor="floor">Select Floor</InputLabel>
                      <Select
                        label="Select Floor"
                        variant="outlined"
                        fullWidth
                        error={!!errors.floorId}
                      >
                        <MenuItem sx={{ justifyContent: 'center' }} value="Select" >
                          Please Select Building
                        </MenuItem>
                      </Select>
                      <FormHelperText sx={{ color:"#d32f2f"}}>{errors.floorId?.message}</FormHelperText>
                    </>
                  )}
                </FormControl>
                
              </Grid>
             
             
              <Grid xs={6} className={styles['grid_top']}>
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
                      {...field}
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container
              className={styles['modal_second_container']}
            >
             
             <Grid xs={6} className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  {selectedFloorId ? (
                    <>
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
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 120
                                  },
                                },
                              }}
                            >
                              {flatList
                                .filter((flat: ViewFlat) => {
                                  return selectedFloorId === null || flat.floor.id === selectedFloorId;

                                })
                                .map((flat: ViewFlat) => (
                                  <MenuItem sx={{justifyContent:"start"}} key={flat.id} value={flat.id}>
                                    {flat.number}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                      </Grid>
                      <FormHelperText sx={{ color:"#d32f2f"}}>{errors.flatId?.message}</FormHelperText>
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
                      <FormHelperText sx={{ color:"#d32f2f"}}>{errors.flatId?.message}</FormHelperText>
                    </>
                  )}
                </FormControl>
                
              </Grid>

              <Grid xs={6} className={styles['grid_top']}>
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
                      {...field}
                      label="Phone Number"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment sx={{mt:'1px'}} position="start">
                            +91
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={6} sx={{mt:"20px"}}>
                <FormControl sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                  error={!!errors.isChild}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px", mr: "5px" }}>Is it a Child?</FormLabel>
                  <Controller
                    name="isChild"
                    control={control}
                    // defaultValue={false}
                    render={({ field }) => (
                      <RadioGroup  {...field} sx={{ display: "flex", flexDirection: "row" }}>
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
                <FormHelperText sx={{ ml:"25px", color:"#d32f2f"}}>{errors.isChild?.message}</FormHelperText>
              </Grid>
              
              <Grid xs={6} className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  <InputLabel htmlFor="type">Resident Type</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    // defaultValue=""
                    rules={{ required: 'Resident Type is required' }}
                    render={({ field }) => (
                      <Select
                        label="Resident Type"
                        variant="outlined"
                        {...field}
                        error={!!errors.type}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 97
                            },
                          },
                        }}
                      >
                       
                        <MenuItem sx={{  justifyContent: "start" }} value="FAMILY_MEMBER">Owner Family Member</MenuItem>
                        <MenuItem sx={{  justifyContent: "start" }} value="OWNER">Owner</MenuItem>
                        <MenuItem  sx={{  justifyContent: "start" }} value="TENANT">Tenant</MenuItem>
                      </Select>
                      
                    )}
                  />
                   <FormHelperText sx={{color:"#d32f2f"}}>{errors.type?.message}</FormHelperText>
                </FormControl>
              </Grid>
             
            </Grid>
          </Grid>

          <Grid className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit">
               Add
            </Button>
            <Button variant="contained" color="secondary" onClick={() => { onClose(); reset() }}>
              Cancel
            </Button>
          </Grid>
        </form>

      </Box>
    </Modal>
  );
}

export default AddResidentComponent;
