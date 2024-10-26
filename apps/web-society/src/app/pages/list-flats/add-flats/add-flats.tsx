/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext, useEffect, useState } from 'react';
import styles from './add-flats.module.scss';
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
import { AddFlat, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, FormHelperText, IconButton, InputAdornment } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

interface AddFlatProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

interface Form {
  buildingId: number;
  floorId: number;
  number: string;
}

const AddFlatComponent: React.FC<AddFlatProps> = ({ open, onClose, onSubmit }) => {

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
  // const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const user=useContext(UserContext);

  const params = useParams();

  const validationSchema = yup.object().shape({
    number: yup.string().required('Flat Number is required'),
    floorId: yup.number().typeError('Floor is required').required('Floor Number is Required'),
    buildingId: yup.number().typeError('Building is required').required('Building Id is required'),
  });

  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<Form>({
    resolver: yupResolver(validationSchema),
  });

  const selectedBuildingId = watch('buildingId');

  const handleFormSubmit = (data: Form) => {
    onSubmit(data);
  };

  const societycontext=useContext(SocietyContext);
  // console.log("society context:",societycontext);
  // console.log("society id:",societycontext?.id);

  useEffect(() => {
    getAllFloors();
  }, [totalValue, selectedBuildingId, user, societycontext]);

  useEffect(() => {
    getAllBuildings();
  }, [totalbuildingValue,user, societycontext]);

  useEffect(() => {
    if (open) {
      reset();
      getAllBuildings();
    }
  }, [open, reset]);

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
      console.log(response.data);
      const { content, total } = response.data;
      setFloorList(content);
      setTotalValue(total);

      const floors = response.data.content;

      setFloorList(floors);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
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
        `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}/floors`,
        newData,
        {
          withCredentials: true,
        }
      );
      console.log("api data" , data, newData)
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

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleCancelAddFloor = () => {
    setShowAddFloorForm(false);
  };

 
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Flat</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl sx={{ m: 1 }} className={styles['textfield_number']}>
            {showAddForm ? (
              <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Building Name"
                      value={buildingName}
                      onChange={(event) => {
                        setBuildingName(event.target.value as string);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton sx={{ marginLeft: '-8px', marginRight: '-8px' }} >
                              <DoneIcon onClick={handleOnAddBuildingSubmit} />
                            </IconButton>
                            <IconButton sx={{ marginLeft: '-8px', marginRight: '-12px' }}>
                              <ClearIcon onClick={handleCancelAdd} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <><Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                <InputLabel htmlFor="building">Building*</InputLabel>
                <Controller
                  name="buildingId"
                  control={control}
                  // defaultValue={null}
                  rules={{ required: 'Building Id is required' }}
                  render={({ field }) => (
                    <Select
                      label="Building*"
                      variant="outlined"
                      error={!!errors.buildingId}
                      {...field}
                      fullWidth
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200
                          },
                        },
                      }}
                    >
                      {/* <MenuItem onClick={() => setShowAddForm(true)} sx={{ backgroundColor: "#f5e1f4" }}><AddIcon sx={{ mr: "3px" }} fontSize='small' /> Add New Building</MenuItem> */}
                      {buildingList.map((building: Building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )} />
              </Box>
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.buildingId?.message}</FormHelperText>
              </>
            )}

          </FormControl>
          <FormControl sx={{ m: 1 }} className={styles['textfield_number']}>
            {selectedBuildingId ? (
              <>
                {showAddFloorForm ? (
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>

                        <TextField
                          type="text"
                          className="form-control"
                          placeholder="Enter Floor Number*"
                          // value={floorNumber}
                          onChange={(event) => {
                            setFloorNumber(event.target.value as string);
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton sx={{ marginLeft: '-8px', marginRight: '-8px' }}>
                                  <DoneIcon onClick={handleOnAddFloorSubmit} />
                                </IconButton>
                                <IconButton sx={{ marginLeft: '-8px', marginRight: '-12px' }} >
                                  <ClearIcon onClick={handleCancelAddFloor} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
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
                          // {...register('floorId')}
                          {...field}
                          label="Floor*"
                          variant="outlined"
                          error={!!errors.floorId}
                          fullWidth
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150
                              },
                            },
                          }}
                        >
                          {/* <MenuItem onClick={() => setShowAddFloorForm(true)}><AddIcon fontSize='small' sx={{ml:'3px'}} />Add New Floor</MenuItem> */}
                          {floorList
                            .filter((floor: ViewFloor) => {
                              return selectedBuildingId === null || floor.building.id === selectedBuildingId;
                            })
                            .map((floor: ViewFloor) => (
                              <MenuItem key={floor.id} value={floor.id}>
                                {floor.number}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </Box>
                )}
                <FormHelperText sx={{ color: "#d32f2f" }}>{errors.floorId?.message}</FormHelperText>
              </>
            ) : (
              <>
                <InputLabel htmlFor="floor">Floor*</InputLabel>
                <Select
                  label="Floor*"
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

          <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: 'Flat Number is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                className={styles['textfield_number']}
                label="Flat Number*"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.number}
                helperText={errors.number?.message}
                sx={{ margin: '10px' }}
              />
            )}
          />
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
              onClick={()=>{onClose(); reset()}}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddFlatComponent;

