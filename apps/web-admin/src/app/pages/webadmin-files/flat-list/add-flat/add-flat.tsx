/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import styles from './add-flat.module.scss';
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface AddFlatProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddFlat) => void;
}

const AddFlatComponent: React.FC<AddFlatProps> = ({ open, onClose, onSubmit }) => {

  const validationSchema = yup.object().shape({
    number: yup.string().required('Vehicle Number is required'),
    floorId: yup.number().required('flatNumber is Required'),
    // isActive:yup.boolean().required()
  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<AddFlat>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  const handleFormSubmit = (data: AddFlat) => {
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Add New Flat</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                      <DoneIcon  onClick={() => {
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
                          <DoneIcon  onClick={() => {
                            handleOnAddFloorSubmit();
                          }} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <InputLabel htmlFor="floor">Select Floor</InputLabel>
                    <Controller
                      name="floorId"
                      control={control}
                      rules={{ required: 'Floor Number is required' }}
                      render={({ field }) => (

                        <Select
                          // {...register('FloorNum')}
                          {...field}
                          label="Select Floor"
                          variant="outlined"
                          error={!!errors.floorId}
                          fullWidth
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

          <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: 'Flat Number is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Flat Number"
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

export default AddFlatComponent;
