import styles from './view-vehicles.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, Grid } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import VehicleLogs from '../../Components/vehicle-logs/vehicle-logs';
import Devices from './devices/devices';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { environment } from '../../../environments/environment';
import { VehicleType } from '@prisma/client';
import { ViewCard, ViewFlat } from '@fnt-flsy/data-transfer-types';
import AddVehicleCard from './add-vehicle-card/add-vehicle-card';
import { enqueueSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditVehicleCard from './edit-vehicle-card/edit-vehicle-card';
import { SocietyContext } from '../../contexts/user-contexts';
import RefreshIcon from '@mui/icons-material/Refresh';
interface Flats {
  flats: ViewFlat
}

interface FlatVehicle {
  cards: {
    id: number;
    number: string;
    type: string;

  }[],
  flats: {
    flats: {
      id: number;
      number: string;
      isActive?: boolean;

      floor: {
        id: number;
        number: string;

        building: {
          id: number;
          name: string;

          society: {
            id: number;
            name: string;
          };
        };
      };
    };
  }[];
  id: number;
  isActive: boolean;
  name: string;
  number: string;
  type: VehicleType;
}

interface AddCard {
  number: string;
  type: string;
}

interface CardDetail {
  id: number;
  number: string;
  type: string
}
/* eslint-disable-next-line */
export interface ViewVehiclesProps { }

function Details() {
  return (
    <div>
      <div>
        <Box sx={{ maxWidth: 200 }}>
          <Grid container spacing={4} >
            <Grid item>Flats:</Grid>
            <Grid item>A02</Grid>
            <Grid item>Owner Name:</Grid>
            <Grid item>Sahil Gupta</Grid>
          </Grid>
        </Box>
      </div>
      <div style={{ marginTop: "80px" }}>
        Vehicle Card: 2367541
      </div>
    </div>
  );
}

export function ViewVehicles(props: ViewVehiclesProps) {

  const [value, setValue] = React.useState('1');
  const [data, setData] = useState<FlatVehicle | null>(null);
  const [cards, setCards] = useState<ViewCard | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const params = useParams();
  const apiUrl = environment.apiUrl;
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [editData, setEditData] = useState<CardDetail | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshLogs, setRefreshLogs] = useState(false);
  const [loadingVehicleCard, setLoadingVehicleCard] = useState(true);
  const [loadingVehicleInfo, setLoadingVehicleInfo] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    getVehicleinfo();
  }, []);

  const societyContext=useContext(SocietyContext);
  console.log("society Context on Vehicle View:",societyContext);
  console.log("society id:",societyContext?.id);

  const getVehicleinfo = async () => {
    try {
      setLoadingVehicleInfo(true)
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings/${params.buildingId}/floors/${params.floorId}/flat/${params.flatId}/vehicles/${params.id}`, {
        withCredentials: true,
      }).then((response) => {
        console.log("Vehcile Detail:", response.data);
        setData(response.data);
        setVehicleId(response.data.id)
        setLoadingVehicleInfo(false);
      }
      )
    } catch (error) {
      console.log("Error in Fecthing Vehcile Details", error);
      setLoadingVehicleInfo(false);
    }
  }

  const getCards = async () => {
    try {
      setLoadingVehicleCard(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/cards`, {
        withCredentials: true
      });
      setCards(response.data);
      setLoadingVehicleCard(false);
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoadingVehicleCard(false);
    }
  };


  useEffect(() => {
    getCards();
  }, [])


  //Floor Update OpenModal
  const handleEditClick = (CardId: number) => {
    const selectedCard: CardDetail | undefined = data?.cards.find(
      (card) => card.id === CardId
    );

    if (selectedCard) {
      setEditData(selectedCard)
      setSelectedCardId(CardId);
      setIsEditModalOpen(true);
    }
  };

  //Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };
  // Add Card
  const handleAddCard = async (formData: AddCard) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${params.societyId}/cards`, { ...formData, vehicleId: vehicleId, isActive: true },
        {
          withCredentials: true,
        },)
      if (data) {
        getVehicleinfo();
        enqueueSnackbar('Card added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });

    }
  }
  // Edit Vehicle Card
  const handleVehicleCardUpdate = async (data: CardDetail) => {
    try {
      const response = await axios.put(
        `${apiUrl}/societies/${params.societyId}/cards/${selectedCardId}`,
        { ...data, vehicleId: vehicleId, isActive: true },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },
      );
      console.log(response.data);

      if (response.data) {
        getVehicleinfo();
        console.log('Card details updated Successfully');
        enqueueSnackbar('Card details updated successfully', { variant: 'success' });
        setIsEditModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  console.log("flats number:", data?.flats[0]?.flats?.number);

  const breadcrumbs = [
    {
      to: '/societies',
      label: 'Societies',
    },
    {
      to:`/societies/${societyContext?.id}`,
      label:`${societyContext?.name}`
    },
    {
      to:`/societies/${societyContext?.id}/vehiclelist`,
      label: 'Vehicles',
    },
    {
      label:`${data?.name}`
    }
  ];

  const handleRefresh = () => {
    console.log("Refreshed clicked");
    setRefreshLogs(true);
  };



  return (
    <div className={styles['container']}>
      {loadingVehicleInfo ? (
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", height:"75vh"}}><CircularProgress /></div>
      ):(<>
      <div style={{marginLeft:"-25px",marginTop:"40px"}}><Breadcrumbs paths={breadcrumbs} /></div>
      <h1>Vehicle Detail</h1>
      <Box className={styles['card_container']}>
        <Card className={styles['vehicle-card']} sx={{ minWidth: 275, boxShadow:8 }}>
          <CardContent>
            <Box>
              <Grid className={styles['vehicle-grid']} container spacing={3} columnGap={0.01} padding={1} >

                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Vehicle Name</Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.name}</Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Vehicle Number</Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.number}</Typography></Grid>

                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Vehicle Type</Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.type}</Typography></Grid>

              </Grid>
            </Box>
          </CardContent>
        </Card>

        {loadingVehicleCard ? (
          <Card className={styles['card-card']} sx={{ minWidth: 275, boxShadow:8 }}>

            <CardContent>
            <Box>
              <Box className={styles['vehicle-grid-empty']}  >
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} ></Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} ></Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} ><CircularProgress /></Typography></Grid>
                <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} ></Typography></Grid>
               
                <Box className={styles['cards-details']}>
                  <Grid item xs={10} justifyContent="flex-end" className={styles['card_button_container']}>
                   
                  </Grid>
                </Box>
              </Box>
            </Box>
          </CardContent>
          </Card>   
              ) : (data?.cards && Array.isArray(data.cards) && data.cards.length > 0 ? (
          data.cards.map((card: CardDetail, index: number) => (
            <React.Fragment key={index} >
              <Card className={styles['card-card']} sx={{ minWidth: 275, boxShadow:8 }}>

                <CardContent>
                  <Box>
                    <Grid className={styles['card-grid']} container spacing={3.5} columnGap={0.01} padding={1}  >
                      <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Number</Typography></Grid>
                      <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{card.number}</Typography></Grid>
                      <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Type</Typography></Grid>
                      <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{card.type}</Typography></Grid>

                      <Box className={styles['cards-details']}>
                        <Grid item xs={10} justifyContent="flex-end" className={styles['card_button_container']}>
                          <Button variant="contained" color="primary" sx={{ cursor: 'pointer', color: 'white' }} onClick={() => handleEditClick(
                            card.id
                          )} >
                            Update
                          </Button>
                        </Grid>
                      </Box>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

            </React.Fragment>
          ))

        ) : (
          <Card className={styles['card-card']} sx={{ minWidth: 275, boxShadow:8 }}>

            <CardContent>
              <Box>
                <Grid className={styles['card-grid']} container spacing={3.5} columnGap={1} padding={1} >
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Number</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >N/A</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >Card Type</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >N/A</Typography></Grid>
                 
                  <Box className={styles['cards-details']}>
                    <Grid item xs={10} justifyContent="flex-end" className={styles['card_button_container']}>
                      <Button size='small' variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)} className={styles['card-button']}>
                        {/* <AddIcon fontSize="small" /> Add */}
                        Update
                      </Button>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </CardContent>
          </Card>
       )
       )}
        <AddVehicleCard
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCard}
        />
        <EditVehicleCard
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleVehicleCardUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />
      </Box>

      <Card sx={{ minWidth: 275, margin: 4 }} className={styles['Details-card']}>
        <CardContent>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' , display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                {/* <Tab className={styles['Tab']} label="Details" value="1" /> */}
                <Tab className={styles['Tab']} label="Logs" value="1" />
                <Tab className={styles['Tab']} label="Devices" value="2" />
              </TabList>
              <Box style={{margin:'9px' }}>
                <RefreshIcon onClick={handleRefresh} style={{cursor:'pointer'}}/>
              </Box>
            </Box>
            {/* <TabPanel value="1"><Details /></TabPanel> */}
            <TabPanel value="1"><VehicleLogs id={data?.id} refreshLogs={refreshLogs}/></TabPanel>
            <TabPanel value="2"><Devices /></TabPanel>
          </TabContext>
        </CardContent>
      </Card>
      </>)}
    </div>
  );
}

export default ViewVehicles;
