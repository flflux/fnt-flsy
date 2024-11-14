import styles from './dashboard.module.scss';
import React, { useState, useEffect, useContext } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Chip, Button, CardActionArea, CardActions, Grid } from '@mui/material';
import { environment } from '../../../environments/environment';
import { assetCount, assetPerBuilding } from '@fnt-flsy/data-transfer-types';
import { Society } from '@fnt-flsy/data-transfer-types';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { SocietyContext, UserContext } from "../../contexts/user-contexts";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AllVehicleLogs from '../../Components/all-vehicle-logs/all-vehicle-logs';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { enqueueSnackbar } from 'notistack';

/* eslint-disable-next-line */
export interface DashboardProps { }

interface SocietyDetails {
  id: string;
  isActive: boolean;
  assetCount: assetCount[];
  name: string
}


interface Manager {
  id: number;
  isPrimary: boolean;
  societyRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}


interface AddForm {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}


const columns: GridColDef[] = [
  { field: 'vehicle', headerName: 'Vehcile', width: 100, flex: 1 },
  // {field:'id', headerName:"Id", width:90},
  {
    field: 'device',
    headerName: 'Device',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'direction',
    headerName: 'Direction',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
    // maxWidth:200
  },
];


export function Dashboard(props: DashboardProps) {
  const [count, setCount] = useState<assetPerBuilding[]>([]);
  const [societydata, setsocietyData] = useState<SocietyDetails[]>([]);
  const [societyId, setsocietyId] = useState<string>('');
  const [society, setSociety] = useState<Society[]>([]);
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);
  const [refreshLogs, setRefreshLogs] = useState(false);
  const [loadingCount, setLoadingCount] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingAllAdmin, setLoadingAllAdmin] = useState(true);
  const [adminData, setAdminData] = useState<Manager[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDeleteId, setAdminToDeleteId] = useState<{ id: number } | null>(null);
  const [editData, setEditData] = useState<Manager | null>(null);
  const [deleteData, setDeleteData] = useState<Manager | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  const params = useParams();
  console.log("params:", params.societyId);

  const societycontext = useContext(SocietyContext);
  //console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);

  useEffect(() => {
    getCount();
  }, [user, societycontext]);

  useEffect(() => {
    getSocietydetails();
  }, [societycontext]);

  useEffect(() => {
    getSocietydetails();
  }, [user]);


  // const getAllAdmin = async () => {
  //   try {
  //     setLoadingAllAdmin(true);
  //     // await new Promise((resolve) => setTimeout(resolve, 2000));
  //     const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/managers`, {
  //       withCredentials: true,
  //     });
  //     // console.log(response.data[0].user)
  //     const sortedResidents = response.data.sort((a: any, b: any) => {
  //       if (a.isPrimary && !b.isPrimary) {
  //         return -1;
  //       }
  //       else if (!a.isPrimary && b.isPrimary) {
  //         return 1;
  //       }
  //       else {
  //         return 0;
  //       }
  //     });
  //     setAdminData(sortedResidents);
  //     console.log("Admin Data", response.data);
  //     setLoadingAllAdmin(false);
  //   } catch (error) {
  //     console.error('Error fetching society data:', error);
  //     setLoadingAllAdmin(false);
  //   }
  // };


  // useEffect(() => {
  //   getAllAdmin();
  // }, [societycontext?.id]);

  console.log("user details", user)
  const dashboardCards = ["Buildings", "Flats", "Residents", "Vehicles", "Devices"];



  const getRandomName = () => {
    // Replace this with a function that generates random names
    const names = ['John Doe', 'Jane Smith', 'Alice Johnson'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomCarNumber = () => {
    // Replace this with a function that generates random car numbers
    return `MH01-XS-${Math.floor(Math.random() * 10000)}`;
  };

  // const data = Array.from({ length: 3 }, (_, index) => ({
  //   id: index,
  //   name: getRandomName(),
  //   // name: getRandomName(),
  //   carNumber: getRandomCarNumber(),
  //   imageUrl: `https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90`,
  // }));

  // const keys=Object.keys(count);
  // const entries=Object.entries(count);
  // console.log(keys,entries);

  const getCount = async () => {
    try {
      setLoadingCount(true);
      const response = await axios.get(`${apiUrl}/asset-count`, {
        withCredentials: true,
      });

      console.log("assestcount dsgdfg:", response.data);
      console.log("societyid:", response.data.id);
      setCount(response.data);
      setsocietyData(response.data);
      setsocietyId(response.data.id);
      setLoadingCount(false);
    } catch (error) {
      console.log("Error in Fetching assetCount", error);
      setLoadingCount(false);
    }
  };
  console.log("Response Data of AssetCount:", societydata);

  const getSocietydetails = async () => {
    console.log("societyId:", societyId);
    try {
      setLoadingDetails(true);
      const response = await axios.get(`${apiUrl}/societies/1`, {
        withCredentials: true,
      });
      console.log("Society Details:", response.data);
      setSociety(response.data);
      setLoadingDetails(false);
    } catch (error) {
      console.log("Error in fetching society details:", error);
      setLoadingDetails(false);
    }
  };



  const generateRandomData = () => ({
    id: Math.floor(Math.random() * 1000),
    vehicle: `Vehicle-${Math.floor(Math.random() * 1000)}`,
    device: `Device-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toLocaleDateString(),
    type: Math.random() > 0.5 ? 'TWO_WHEELER' : 'FOUR_WHEELER',
    direction: Math.random() > 0.5 ? 'In' : 'Out',
    status: Math.random() > 0.5 ? 'Active' : 'Inactive',
  });

  const data = Array.from({ length: 10 }, (_, index) => generateRandomData());




  const countArray = Object.entries(count);
  console.log("countarray",countArray);

  const handleRefresh = () => {
    console.log("Refreshed clicked");
    setRefreshLogs(true);
  };


  // const addadmin = async (formData: AddForm) => {
  //   try {
  //     const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/manager`,
  //       formData,
  //       {
  //         withCredentials: true,
  //       })
  //     if (data) {
  //       getAllAdmin();
  //       setIsAddModalOpen(false);
  //       enqueueSnackbar("Manager added successfully!", { variant: 'success' });
  //     } else {
  //       console.log("Something went wrong");
  //     }
  //     console.log("Manager added successfully", data);
  //   } catch (error) {
  //     console.log("Something went wrong in input form", error);
  //     enqueueSnackbar("Something went wrong!", { variant: 'error' });
  //   }
  // };


  // //Update a Manager

  // const handleUpdate = async (formData: Manager) => {
  //   console.log("in handleupadte");
  //   try {
  //     const res = await axios.put(`${apiUrl}/societies/${societycontext?.id}/managers/${selectedAdminId}`,
  //       { firstName: formData.user.firstName, lastName: formData.user.lastName, email: formData.user.email, phoneNumber: formData.user.phoneNumber, isPrimary: formData.isPrimary },
  //       { withCredentials: true }
  //     );

  //     if (res.data) {
  //       getAllAdmin();
  //       console.log('Manager Updated Successfully');
  //       enqueueSnackbar("Manager updated successfully!", { variant: 'success' });
  //       console.log(res.data);
  //       // setIsModalOpen(false);  
  //     } else {
  //       console.log('Update data not received');
  //       enqueueSnackbar("Error in Manager updation!", { variant: 'error' });
  //     }
  //   }
  //   catch (error) {
  //     console.log('Something went wrong in Update', error);
  //     enqueueSnackbar("Something went wrong in update", { variant: 'error' });
  //   }
  // };



  // //delete a Manager

  // const handleDelete = async (Admin: { id: number } | null) => {
  //   try {
  //     const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/managers/${Admin?.id}`, {
  //       withCredentials: true,
  //     }
  //     );
  //     // getAllAdmin();
  //     console.log("delete:", data);
  //     console.log('Manager DeActive successfully');
  //     enqueueSnackbar("Manager deleted successfully!", { variant: 'success' });
  //     getAllAdmin();
  //   } catch (error) {
  //     console.log(error)
  //     console.log("Something went wrong");
  //     enqueueSnackbar("Something went wrong", { variant: 'error' });
  //   }
  // }


  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setAdminToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditClick = (AdminId: number) => {
    const selectedAdmin: Manager | undefined = adminData.find(
      (admin) => admin.user.id === AdminId
    );

    if (selectedAdmin) {
      setEditData(selectedAdmin)
      setSelectedAdminId(AdminId);
      console.log("Admin Id:", AdminId);
      setIsEditModalOpen(true);
    }
  };

  const openDeleteModal = (Admin: { id: number } | null) => {
    const selectedAdmin: Manager | undefined = adminData.find(
      (Admins) => Admins.user.id === Admin?.id
    );

    if (selectedAdmin) {
      setDeleteData(selectedAdmin);
      setAdminToDeleteId(Admin);
      console.log("AdminToDeleteId:", adminToDeleteId);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <div className={styles['container']}>
      {loadingDetails ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "75vh" }}><CircularProgress /></div>
      ) : (
        <div className={styles['main_container']}>
          <div className={styles['first_container']}>
            <div className={styles['header']}>
              <h1 style={{ marginLeft: '0px' }}>Welcome {user?.firstName}!</h1><p>
                {/* <div color="text.secondary">{society?.addressLine1},</div>
                <div color="text.secondary">{society?.addressLine2}</div> */}
              </p>

            </div><div>

              <div className={styles['dashboard-cards']}>
                {countArray.map(([item, value]) => (
                  <Card className={styles['cards']}>
                  
                      <CardContent className={styles['cardcontent']}>
                        <Typography variant="h6" color="text.secondary" gutterBottom className={styles['fields']}>
                          {item}
                        </Typography>
                        <Typography className={styles['count']}>
                          {value}
                          <br />
                        </Typography>
                      </CardContent>
                    
                  </Card>
                ))}
              </div>
            </div>

            {/* <div className={styles['horizontal-line']} /> */}

            {/* <div>
  {data.map((item) => (
    <Card
      key={item.id}
      className={styles['logs-card']}
      sx={{
        display: 'flex',
        maxWidth: 300,
        border: '1px solid #ddd',
        borderRadius: 5,
        margin: 2,
      }}
    >
      <div className={styles['active-logs']} />
      <CardMedia
        component="img"
        height="140"
        image={item.imageUrl}
        alt="Image Description"
        className={styles['cardmedia']}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="body2" component="div" className={styles['logs-name']}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Car Number: {item.carNumber}
        </Typography>
      </CardContent>
    </Card>
  ))}
</div> */}



            {/* <Box sx={{ height: 400, width: '90%', display:'flex', flexDirection:'row', margin:'20px' }}>
  <DataGrid
    rows={data}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
      },
    }}
    pageSizeOptions={[5]}
    checkboxSelection
    disableRowSelectionOnClick
  />
</Box> */}

            {/* <Box className={styles['logs']}>
              <Box style={{ margin: '9px', float: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                <RefreshIcon onClick={handleRefresh} style={{ cursor: 'pointer' }} />
              </Box>
              <AllVehicleLogs refreshLogs={refreshLogs} />
            </Box> */}

          </div>

          {/* <div className={styles['vertical-line']} /> */}

          {/* <div className={styles['column_second']}>

          </div> */}
        </div>
      )
      }
    </div >
  );
}

export default Dashboard;
