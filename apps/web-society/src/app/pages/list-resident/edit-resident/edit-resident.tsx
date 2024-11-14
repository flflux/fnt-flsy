/* eslint-disable react/jsx-no-useless-fragment */
import styles from './edit-resident.module.scss';
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
import { ViewBuilding, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox, Dialog, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import { SocietyContext, UserContext } from "../../../contexts/user-context";
import { useTheme } from '@mui/system';

export interface EditResidentProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: EditForm) => void;
  initialData: EditForm | null;
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
      isPrimary:boolean;
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


const EditResidentComponent: React.FC<EditResidentProps> = ({ open, onClose, onUpdate, initialData }) => {

  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<ViewBuilding[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  const user = useContext(UserContext);
  const theme = useTheme();

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    isChild: yup.boolean().required('Please Select One'),
    flats: yup.array().of(
      yup.object().shape({
        type: yup.string().required('Please Select One'),
        isPrimary: yup.boolean().notRequired()
      })),
    flatId: yup.number().required('FlatId is required'),
    floorId: yup.number().required('FloorId is required'),
    buildingId: yup.number().required('BuildingId is required'),
  });

  console.log('edit response component response')
  console.log(initialData?.flats)


  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm<EditForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  const selectedBuildingId = watch('buildingId');
  const selectedFloorId = watch('floorId');

  const societycontext=useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  const initialBuildingId = initialData?.flats[0].flat.floor.building.id ?? null;
  const initialFloorId = initialData?.flats[0].flat.floor.id ?? null;
  const initialFlatId = initialData?.flats[0].flat.id ?? null;

  useEffect(() => {
    getAllBuildings();
    getAllFloors();
    getAllFlats();
  }, [totalbuildingValue, totalFlatValue, totalValue, selectedBuildingId, selectedFloorId, user, societycontext]);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('email', initialData.email);
      setValue('phoneNumber', initialData.phoneNumber);
      setValue('isChild', initialData.isChild);
      setValue('flats.0.type', initialData.flats[0].type);
      setValue('floorId', initialData.flats[0].flat.floor.id);
      setValue('buildingId', initialData.flats[0].flat.floor.building.id);
      setValue('flatId', initialData.flats[0].flat.id);
      console.log( initialData?.flats[0].isPrimary)
      setValue('flats.0.isPrimary', initialData?.flats[0].isPrimary);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: EditForm) => {
    onUpdate(data);
    reset();
    setValue('buildingId', initialBuildingId || 0);
    setValue('floorId', initialFloorId || 0);
    setValue('flatId', initialFlatId || 0);
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

      const flats = response.data.content;
      console.log("Floor", response.data);
      setFlatList(flats);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };


 


  const handleCancel = () => {
    reset();
    setValue('buildingId', initialBuildingId || 0);
    setValue('floorId', initialFloorId || 0);
    setValue('flatId', initialFlatId || 0);
    onClose()
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Resident</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {/* <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}> */}
          <Grid container xs={11} columnSpacing={5} sx={{ m: 'auto' }}

          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <FormControl sx={{ width: '100%' }}>
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
                        {buildingList.map((building) => (
                          <MenuItem sx={{ justifyContent: 'center' }} key={building.id} value={building.id}>
                            {building.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )} />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Resident Name"
                      {...field}
                      label="Name*"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <FormControl sx={{ width: '100%' }}>
                  {selectedBuildingId ? (
                    <>
                      <InputLabel htmlFor="floor">Floor*</InputLabel>
                      <Controller
                        name="floorId"
                        control={control}
                        // defaultValue=""
                        rules={{ required: 'Floor Number is required' }}
                        render={({ field }) => (
                          <Select
                            label="Floor*"
                            variant="outlined"
                            {...field}
                            disabled
                          >
                            {floorList
                              .filter((floor) => selectedBuildingId === null || floor.building.id === selectedBuildingId)
                              .map((floor) => (
                                <MenuItem sx={{ justifyContent: 'center' }} key={floor.id} value={floor.id}>
                                  {floor.number}
                                </MenuItem>
                              ))}
                          </Select>
                        )} />
                    </>
                  ) : (
                    <>
                      <InputLabel htmlFor="floor">Floor*</InputLabel>
                      <Select label="Floor*" variant="outlined">
                        <MenuItem sx={{ justifyContent: 'center' }} value="Select">
                          Please Select Building
                        </MenuItem>
                      </Select>
                      <FormHelperText sx={{ color: "#d32f2f" }}>{errors.floorId?.message}</FormHelperText>
                    </>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <TextField
                      type="email"
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Resident Email"
                      {...field}
                      label="Email*"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled
                    />
                  )}
                />
              </Grid>

            </Grid>
            <Grid container
              spacing={2}
            >
              <Grid item xs={12} md={6} sx={{ mt: '15px' }}>
                <FormControl sx={{ width: '100%' }}>
                  {selectedFloorId ? (
                    <>
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                        <InputLabel htmlFor="flat">Flat*</InputLabel>
                        <Controller
                          name="flatId"
                          control={control}
                          // defaultValue=""
                          rules={{ required: 'Flat Id is required' }}
                          render={({ field }) => (
                            <Select
                              label="Flat*"
                              variant="outlined"
                              error={!!errors.flatId}
                              {...field}
                              fullWidth
                              disabled

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
                      <InputLabel htmlFor="flat">Flat*</InputLabel>
                      <Select label="Flat*" variant="outlined" fullWidth>
                        <MenuItem sx={{ justifyContent: 'center' }} value="Select">
                          Please Select Floor
                        </MenuItem>
                      </Select>
                      <FormHelperText sx={{ color: "#d32f2f" }}>{errors.flatId?.message}</FormHelperText>
                    </>
                  )}
                </FormControl>
                {/* </Box>
          </Box> */}
              </Grid>
              <Grid item xs={12} md={6} sx={{ mt: '15px' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Phone Number is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      inputMode="numeric"
                      sx={{ width: '100%' }}
                      className="form-control"
                      placeholder="Enter Resident Phone Number"
                      {...field}
                      label="Phone Number*"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment sx={{mt:"1px"}} position="start">
                            +91
                          </InputAdornment>
                        ),
                      }}
                      disabled
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: "10px" }}>
                {/* <Box className={styles['modal_second_container']} sx={{ mb: "15px", mt: "15px" }}> */}
                <FormControl sx={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: "center" }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px", mr: "5px" }} >Is it a Child?*</FormLabel>
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
                <FormHelperText sx={{ ml: "58px", color: "#d32f2f" }}>{errors.isChild?.message}</FormHelperText>

              </Grid>

              <Grid item xs={12} md={6} className={styles['grid_top']}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel htmlFor="resident">Resident Type*</InputLabel>
                  <Controller
                    name="flats.0.type"
                    control={control}
                    // defaultValue=""
                    rules={{ required: 'Resident Type is required' }}
                    render={({ field }) => (
                      <Select
                        label="Resident Type*"
                        variant="outlined"
                        {...field}
                        error={!!errors.flats?.type}
                      >
                        {/* <FormHelperText>{errors.flats?.type.message}</FormHelperText> */}
                        <MenuItem sx={{ justifyContent: "start" }} value="FAMILY_MEMBER" >Owner Family Member</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="OWNER">Owner</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="TENANT">Tenant</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{errors.flats?.[0]?.flat?.type}</FormHelperText>
                </FormControl>
                </Grid>
                <Grid xs={6} sx={{mt:"10px", ml:"25px"}}>
                <FormControl sx={{ display: "flex", flexDirection: "row" }}>
                  {/* error={!!errors.isPrimary} */}
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px"}}>Is it a Primary Contact?*</FormLabel>
                  {(initialData?.flats[0].isPrimary===true)?
                       <Controller
                       name="flats.0.isPrimary"
                       control={control}
                       defaultValue={true}
                       render={({ field }) => (

                        <Checkbox  {...field} sx={{ display: "flex", flexDirection: "row", '&.Mui-disabled': {
                          color: theme.palette.primary.main, 
                        }, }} disabled defaultChecked/>
                       )}
                     />
                     :
                     <Controller
                       name="flats.0.isPrimary"
                       control={control}
                       defaultValue={false}
                       render={({ field }) => (
                         <Checkbox  {...field} sx={{ display: "flex", flexDirection: "row" }}/>
                       )}
                     />
                  }
                </FormControl>
                </Grid>
                {/* </Box>
             */}




            </Grid>
          </Grid>
          <Box className={styles['update_modal-buttons']}>
            <Button className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => { onClose(); reset() }}>
              Cancel
            </Button>
          </Box>
        </form >
      </Box >
    </Modal>
  );
}

export default EditResidentComponent;
