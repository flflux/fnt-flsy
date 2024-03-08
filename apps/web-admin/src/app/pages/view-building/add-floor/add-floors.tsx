import styles from './add-floors.module.scss';
/* eslint-disable react/jsx-no-useless-fragment */
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
import { Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IconButton, InputAdornment } from '@mui/material';
import { useParams } from 'react-router-dom';

interface AddFloorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
  buildingId: number | null;
}

interface Form {
  buildingId: number;
  number: string;
  
}

const AddFloorComponent: React.FC<AddFloorProps> = ({ open, onClose, onSubmit, buildingId }) => {

  const apiUrl = environment.apiUrl;
  const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [totalFloorValue, setTotalFloorValue] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [buildingName, setBuildingName] = useState<string>('');
  const validationSchema = yup.object().shape({
    number: yup.string().required('Floor Number is required'),
    buildingId: yup.number().required('Building Id is Required'),
  });
  const { setValue, register, handleSubmit, control, reset, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(validationSchema),
  });

  const params=useParams();

  useEffect(() => {
    if (buildingId) {
      setValue('buildingId', buildingId);
    }
  }, [buildingId, setValue]);

  const initialBuildingId = buildingId ?? null;

  const handleFormSubmit = (data: Form) => {
    setValue('buildingId', initialBuildingId || 0);
    onSubmit(data);

  };

  useEffect(() => {
    if (open) {
      reset();
      setValue('buildingId', initialBuildingId || 0);
    }
  }, [open, reset]);

  const getAllBuildings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings`, {
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


  useEffect(() => {
    getAllBuildings();
  }, [totalbuildingValue, totalFloorValue]);



  const handleOnAddBuildingSubmit = async () => {

    try {
      const newData = {
        name: buildingName,
        societyId: 1,
        isActive: true,
      };
      const { data } = await axios.post(
        `${apiUrl}/societies/${params.societyId}/buildings`,
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

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleCancel = () => {
    reset();
    setValue('buildingId', initialBuildingId || 0);
    onClose()
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Floor</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* <FormControl sx={{ m: 1, width: 260 }}> */}
            {showAddForm ? (
              <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter new Building Name"
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
              <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
                <FormControl sx={{ m: 1, width: 260 }}>
                <InputLabel htmlFor="building">Building*</InputLabel>
                {/* <Select
                  {...register('buildingId')}
                  label="Select Building"
                  variant="outlined"
                  
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
                  <MenuItem onClick={() => setShowAddForm(true)} sx={{ backgroundColor: "#f5e1f4" }}><AddIcon sx={{ mr: "3px" }} fontSize='small' /> Add New Building</MenuItem>

                  {buildingList.map((building: Building) => (
                    <MenuItem sx={{ justifyContent: 'start' }} key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select> */}
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
                      {buildingList.map((building: Building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )} />
                  </FormControl>
              </Box>
            )}
          {/* </FormControl> */}
          <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: 'Floor Number is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Floor Number*"
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
              onClick={() => {  handleCancelAdd();handleCancel() }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddFloorComponent;

