import styles from './edit-flats.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddFlat, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { Dialog, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

export interface EditFlatProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: ViewFlat | null;
}

interface Form{
  buildingId:number;
  floorId:number;
  number:string;
}

const EditFlatComponent: React.FC<EditFlatProps> = ({ open, onClose, onUpdate, initialData }) => {
  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user=useContext(UserContext);
  const params=useParams();

  const validationSchema = yup.object().shape({
    number: yup.string().required('Flat Number is required'),
    floorId: yup.number().required('Floor Id is Required'),
    buildingId:yup.number().required('Building Id is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues:{
      ...initialData,
      // isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number);
      setValue('floorId', initialData.floor.id);
      setValue('buildingId',initialData.floor.building.id);
    }
  }, [initialData, setValue, user]);

  const selectedBuildingId = watch('buildingId');
  // const selectedFloorId = watch('floorId');

  const handleUpdate = (data: Form) => {
    onUpdate(data);
    onClose();
    reset();
  };

  const societycontext=useContext(SocietyContext);
  // //console.log("society context:",societycontext);
  // console.log("society id:",societycontext?.id);

  useEffect(() => {
    getAllBuildings();
    getAllFloors();
  }, [selectedBuildingId, user, societycontext]);



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
      console.log("selected buildsing ",selectedBuildingId)
      if(selectedBuildingId == undefined) {
        return;
      }
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors`, {
        withCredentials: true,
        params: {
          pageSize: totalValue,
        }
      });
      console.log("floors:",response.data);
      const { content, total } = response.data.content;
      setFloorList(content);
      setTotalValue(total);

      const floors = response.data.content;
      // console.log(selectedBuildingId);

      setFloorList(floors);

    } catch (error) {
      console.log(error);
      console.log('Something went wrong in fetching All FLoors');
    }
  };


 

  return (
    <Modal open={open} onClose={onClose}>
          <Box className={styles['modal-container']}>
            <h2 className={styles['h2_tag']}>Edit Flat</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <FormControl sx={{ m: 1 }} className={styles['textfield_number']}>
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
                  // {...register('buildingId')}
                  {...field}
                  // value={selectedBuildingId || ''}
                  // onChange={(event) => {
                  //   setSelectedBuildingId(event.target.value as number);
                  // }}
                  // defaultValue={initialData?.floor.building.name}
                  disabled
                >
                  {buildingList.map((building: Building) => (
                    <MenuItem sx={{ justifyContent: 'center' }} key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
                )}/>
              </FormControl>
              <FormControl sx={{ m: 1 }} className={styles['textfield_number']}>
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
                          // {...register('floorId')}
                          {...field}
                          label="Floor*"
                          variant="outlined"
                          error={!!errors.floorId}
                          // value={selectedBuildingId || ''}
                          disabled
                        >
                          {Array.isArray(floorList) && floorList.length > 0 ? (
                            floorList
                              .filter((floor: ViewFloor) => {
                                return selectedBuildingId === null || floor.building.id === selectedBuildingId;
                              })
                              .map((floor: ViewFloor) => (
                                <MenuItem sx={{ justifyContent: 'center' }} key={floor.id} value={floor.id}>
                                  {floor.number}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem sx={{ justifyContent: 'center' }} value="NoData">
                              No Data Available
                            </MenuItem>
                          )}
                        </Select>
                      )}/>
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor="floor">Floor*</InputLabel>
                    <Select
                      label="Floor*"
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
                    sx={{ m: 1 }} className={styles['textfield_number']}
                    label="Flat Number*"
                    variant="outlined"
                    size="medium"
                    // {...register('FlatNum')}
                    {...field}
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    // sx={{ margin: "10px" }}
                  />
                )}
              />
              <Box className={styles['update_modal-buttons']}>
                <Button sx={{mr:"10px"}} className={styles['edit_button']} variant="contained" color="primary" type="submit" >
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

export default EditFlatComponent;

