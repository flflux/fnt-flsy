import styles from './view-devices.module.scss';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import VehicleLogs from '../../Component/vehicle-logs/vehicle-logs';
import Vehicles from './vehicles/vehicles';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { environment } from '../../../environments/environment';
import { Device } from '@fnt-flsy/data-transfer-types';
import { SocietyContext, UserContext } from "../../contexts/user-context";
import DeviceLogs from '../../Component/device-logs/device-logs';
import RefreshIcon from '@mui/icons-material/Refresh';
import { enqueueSnackbar } from 'notistack';
import { PhotoCamera } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import { STATUS_CODES } from 'http';

/* eslint-disable-next-line */
export interface ViewDevicesProps { }

interface AddImage {
  file: string;
}

function Devices() {
  return (
    <div>

    </div>
  );
}

export function ViewDevices(props: ViewDevicesProps) {

  const [value, setValue] = React.useState('1');
  const [data, setData] = useState<Device | null>(null);
  const [refreshLogs, setRefreshLogs] = useState(false);

  const params = useParams();
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loadingDeviceInfo, setLoadingDeviceInfo] = useState(true);
  const [loadingDeviceImage, setLoadingDeviceImage] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const societycontext = useContext(SocietyContext);
  console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);

  useEffect(() => {
    getDeviceInfo();
  }, [user, societycontext]);

  const getDeviceInfo = async () => {

    try {
      setLoadingDeviceInfo(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/devices/${params.id}`, {
        withCredentials: true,
      });
      setData(response.data);

      setDeviceId(response.data.id)
      console.log("Device Detail:", response.data);
      console.log("Device Detail:", response.data.name);
      setLoadingDeviceInfo(false);
    } catch (error) {
      console.log("Error in fetching device details", error);
      setLoadingDeviceInfo(false);
    }

  }

  // const arrayToBase64 = (uint8Array: Uint8Array) => {
  //   const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  //   return btoa(binaryString);
  // };


  const getDeviceImage = useCallback(async () => {

    try {
      setLoadingDeviceImage(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/devices/${params.id}/images`, {
        withCredentials: true,
      });
      const concatenatedArray = [...response.data.data];
      const uint8Array = new Uint8Array(concatenatedArray);
      const base64Image = btoa(String.fromCharCode(...uint8Array));

      console.log("Uint8Array:", uint8Array);
      console.log("Base64 Image:", base64Image);
      setImageData(`data:image/png;base64, ${base64Image}`);
      setLoadingDeviceImage(false);
    } catch (error) {
      console.log("Erorr in fetching device details", error);
      setLoadingDeviceImage(false);
    } finally {
      setLoading(false);
    }

  },
    [apiUrl, societycontext?.id, params.id]
  )


  useEffect(() => {
    getDeviceImage();
  }, [getDeviceImage]);

  const handleRefresh = () => {
    console.log("Refreshed clicked");
    setRefreshLogs(true);
  };




  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      try {
        const existingImageData = await axios.get(
          `${apiUrl}/societies/${societycontext?.id}/devices/${deviceId}/images`,
          {
            withCredentials: true,
          },
        );

        const concatenatedArray = [...existingImageData.data.data];
        const uint8Array = new Uint8Array(concatenatedArray);
        const base64Image = btoa(String.fromCharCode(...uint8Array));
        console.log("Base64 Image:", base64Image);
        console.log("Existing Image:", existingImageData);


        if (base64Image) {

          await axios.delete(
            `${apiUrl}/societies/${user?.societyRoles[0].societyId}/devices/${deviceId}/image`,
            {
              withCredentials: true,
            },
          );

          if (event.target.files && event.target.files.length > 0) {
            // const formData = new FormData();
            // formData.append('file', event.target.files[0]);
            // formData.append('device_id', String(deviceId));
            const selectedFile = event.target.files[0];

            if (selectedFile.size > 399 * 1024) {
              console.error('File size exceeds the limit of 399 kb');
              enqueueSnackbar('File size exceeds the limit of 399 kb', { variant: 'error' });
              return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('device_id', String(deviceId));

            const { data } = await axios.post(
              `${apiUrl}/societies/${user?.societyRoles[0].societyId}/devices/images`,
              formData,
              {
                withCredentials: true,
              },
            );

            if (data) {
              getDeviceImage();
              console.log('Image uploaded successfully', data);
              enqueueSnackbar('Image uploaded successfully', { variant: 'success' });

            } else {
              console.log('Something went wrong');
              enqueueSnackbar('Image is already uploaded', { variant: 'error' });
            }
          }
          console.log('Previous image deleted successfully');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            if (axiosError.response.status === 404) {

              if (event.target.files && event.target.files.length > 0) {
                // const formData = new FormData();
                // formData.append('file', event.target.files[0]);
                // formData.append('device_id', String(deviceId));
                const selectedFile = event.target.files[0];

                if (selectedFile.size > 399 * 1024) {
                  console.error('File size exceeds the limit of 399 kb');
                  enqueueSnackbar('File size exceeds the limit of 399 kb', { variant: 'error' });
                  return;
                }

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('device_id', String(deviceId));

                const { data } = await axios.post(
                  `${apiUrl}/societies/${user?.societyRoles[0].societyId}/devices/images`,
                  formData,
                  {
                    withCredentials: true,
                  },
                );

                if (data) {
                  getDeviceImage();
                  console.log('Image uploaded successfully', data);
                  enqueueSnackbar('Image uploaded successfully', { variant: 'success' });

                } else {
                  console.log('Something went wrong');
                  enqueueSnackbar('Image is already uploaded', { variant: 'error' });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 422) {
            enqueueSnackbar('Please upload a valid image file (png, jpeg, jpg)', { variant: 'error' });
          } else {
            console.log('Request failed with status code 400:', axiosError.response.data);
            enqueueSnackbar('Failed to upload image', { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Error uploading image', { variant: 'error' });
        }
      }
    }

  };




  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      to: `/society/${societycontext?.id}/devices`,
      label: 'Devices',
    },
    {
      label: `${data?.name}`
    }
  ];

  return (
    <div className={styles['container']}>
      {loadingDeviceInfo ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "75vh" }}><CircularProgress /></div>
      ) : (<>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['main_container']}>
          <h1>Device Details</h1>
          <Box className={styles['card-container']}>
            <Card className={styles['device-card']} sx={{ minWidth: 275, boxShadow: 8 }}>
              <CardContent>
                <Grid className={styles['vehicle-grid']} container spacing={3.6} columnGap={0.01} padding={1} >
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Device Name</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.name}</Typography></Grid>

                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Device Type</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.type}</Typography></Grid>

                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Device Id</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.id}</Typography></Grid>

                  {/* <Grid item xs={5}  justifyContent="flex-start"><Typography className={styles['card-typo']} >Device Key</Typography></Grid>
            <Grid item xs={5}  justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.deviceKey}</Typography></Grid> */}

                </Grid>
              </CardContent>
            </Card>


            {/* {data?.cards && Array.isArray(data.cards) && data.cards.length > 0 ? (
            data.cards.map((card: CardDetail, index: number) => ( */}
            {/* <React.Fragment key={index} > */}
            <Card className={styles['card-card']} sx={{ minWidth: 275, boxShadow: 8 }}>

              <CardContent>
                <Box>
                  <Grid className={styles['vehicle-grid']} container spacing={0} columnGap={0.1} padding={0} >
                    {/* <Grid item xs={1} justifyContent="flex-start"><Typography className={styles['card-typo']} >Device Image</Typography></Grid> */}
                    <Grid item xs={1} justifyContent="flex-start"><Typography className={styles['card-typo']} >
                      {/* {imageData ? <img src={imageData} className={styles['upload_image']}  alt="Device" /> : 'N/A'} */}
                      {loading ? (
                        <CircularProgress className={styles['loading_indicator']} />
                      ) : (
                        imageData ? (
                          <img src={imageData} className={styles['upload_image']} alt="Device" />
                        ) : (
                          <Grid item xs={5} padding={1} justifyContent="flex-start"><Typography className={styles['card-typo']} >N/A</Typography></Grid>
                        )
                      )}
                    </Typography>
                    </Grid>

                    <Box className={styles['cards-details']}>
                      <Grid item xs={1} justifyContent="flex-end" className={styles['card_upload_button_container']}>
                        <Box>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".png, .jpeg, .jpg"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <PhotoCamera
                            color="primary"
                            sx={{ fontSize: 35 }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                          </PhotoCamera>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* </React.Fragment> */}
            {/* ))

          ) : ( */}
            {/* <Card className={styles['card-card']} sx={{ minWidth: 275 }}>

              <CardContent>
                <Box>
                  <Grid className={styles['vehicle-grid']} container spacing={4} columnGap={1} padding={2} >
                    <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Number</Typography></Grid>
                    <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >N/A</Typography></Grid>
                    <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Type</Typography></Grid>
                    <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >N/A</Typography></Grid>

                    <Box className={styles['cards-details']}>
                      <Grid item xs={10} justifyContent="flex-end" className={styles['card_button_container']}>
                        <Button size='small' variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)} className={styles['card-button']}>
                          
                          Update
                        </Button>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              </CardContent>
            </Card> */}
            {/* )} */}

            {/* <AddDeviceImage
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddImage}
        /> */}
          </Box>

          <Card sx={{ minWidth: 275, margin: 4 }} className={styles['Details-card']}>
            <CardContent>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab className={styles['Tab']} label="Logs" value="1" />
                    <Tab className={styles['Tab']} label="Vehicles" value="2" />
                  </TabList>
                  <Box style={{ margin: '9px' }}>
                    <RefreshIcon onClick={handleRefresh} style={{ cursor: 'pointer' }} />
                  </Box>
                </Box>
                {/* <Button
                  className={styles['add_btn']}
                  onClick={() => {
                    // Handle the click event for "Add New Flat" button
                  }}
                >
                  Add 
        </Button> */}
                <Box>
                  <TabPanel value="1"><DeviceLogs id={data?.id} refreshLogs={refreshLogs} /></TabPanel>
                  <TabPanel value="2"><Vehicles id={params.id} /></TabPanel>
                </Box>
              </TabContext>
            </CardContent>
          </Card>

        </Box>
      </>)}

    </div>
  );
}

export default ViewDevices;
