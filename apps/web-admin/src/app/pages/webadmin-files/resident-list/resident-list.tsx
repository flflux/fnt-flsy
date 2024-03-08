/* eslint-disable react/jsx-no-useless-fragment */
import styles from './resident-list.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddResident, Resident, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import AddResidentComponent from './add-resident/add-resident';
import EditResidentComponent from './edit-resident/edit-resident';
import DeleteResidentComponent from './delete-resident/delete-resident';


// interface Building {
//   id: number;
//   name: string;
//   isActive: boolean;
//   handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
//   value: string;
//   setValue: (value: string) => void;
// }

/* eslint-disable-next-line */
export interface ListResidentsProps { }

export function ListResidents(props: ListResidentsProps) {
  const apiUrl = environment.apiUrl;
  const [activeFlatResidents, setActiveFlatResidents] = useState<Resident[]>([]);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().min(10).required('Phone number is required'),
    isChild: yup.boolean().required('Please Select Option'),
    type: yup.string().required('Please Select Option'),
    flatId: yup.string().required('FlatId is required'),

  });

  const { reset: resetForm } = useForm({ resolver: yupResolver(validationSchema) });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
  const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ResidentToDeleteId, setResidentToDeleteId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  // const [buildingList, setBuildingList] = useState<Building[]>([]);
  // const [floorList, setFloorList] = useState<ViewFloor[]>([]);
  // const [flatList, setFlatList] = useState<ViewFlat[]>([]);
  // const [totalValue, setTotalValue] = useState<number | null>(null);
  // const [totalbuildingValue, setTotalbuildingValue] = useState<number | null>(null);
  // const [totalFlatValue, setTotalFlatValue] = useState<number | null>(null);
  // const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  // const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  // const [showAddFlatForm, setShowAddFlatForm] = useState(false);
  // const [floorNumber, setFloorNumber] = useState<string>('');
  // const [flatNumber, setFlatNumber] = useState<string>('');
  // const [buildingName, setBuildingName] = useState<string>('');
  const [editData, setEditData] = useState<AddResident | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const getSingleFlatResidents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/1/residents`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
          email: searchQueryEmail,
          phoneNumber: searchQueryPhone
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveFlatResidents(content);

      const flatResidents = response.data.content;
      const filteredFlatResidents = flatResidents.filter(
        (resident: { id: number; name: string; isActive: boolean; flat: { id: number; number: string; isActive: boolean; floor: { id: any; number: string; building: { id: any; name: string } } } }) =>
          resident.isActive === true
      );

      // filteredFlatResidents.forEach((resident: any) => {
      //   const isActive = resident.isActive;
      //   setActives(isActive);
      //   console.log(isActive);
      // });

      console.log(filteredFlatResidents)
      setActiveFlatResidents(filteredFlatResidents);

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
    }
  };

  // const getAllBuildings = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/societies/1/buildings`, {
  //       withCredentials: true,
  //       params: {
  //         pageSize: totalbuildingValue,
  //       }
  //     });
  //     console.log(response.data);
  //     const { content, total } = response.data;
  //     setBuildingList(content);
  //     setTotalbuildingValue(total);

  //     const buildings = response.data.content;
  //     const activeBuildings = buildings.filter(
  //       (building: {
  //         id: number;
  //         name: string;
  //         isActive: boolean;
  //         society: { id: any };
  //       }) => building.isActive === true
  //     );
  //     console.log(response.data);
  //     setBuildingList(activeBuildings);
  //   } catch (error) {
  //     console.log(error);
  //     console.log('Something went wrong');
  //   }
  // };

  // const getAllFloors = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/floors`, {
  //       withCredentials: true,
  //       params: {
  //         pageSize: totalValue,
  //       }
  //     });
  //     console.log(response.data);
  //     const { content, total } = response.data;
  //     setFloorList(content);
  //     setTotalValue(total);

  //     const floors = response.data.content;
  //     const activeFloors = floors.filter(
  //       (floor: {
  //         id: number;
  //         number: string;
  //         isActive: boolean;
  //         buildingId: number
  //       }) => floor.isActive === true
  //     );
  //     console.log("Floor", response.data);
  //     console.log("Floor", activeFloors.floor.buildingId);
  //     setFloorList(activeFloors);
  //   } catch (error) {
  //     console.log(error);
  //     console.log('Something went wrong');
  //   }
  // };


  // const getAllFlats = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/flats`, {
  //       withCredentials: true,
  //       params: {
  //         pageSize: totalFlatValue,
  //       }
  //     });
  //     console.log(response.data);
  //     const { content, total } = response.data;
  //     setFlatList(content);
  //     setTotalFlatValue(total);

  //     const flats = response.data.content;
  //     const activeFlats = flats.filter(
  //       (flat: {
  //         id: number;
  //         number: string;
  //         isActive: boolean;
  //       }) => flat.isActive === true
  //     );
  //     console.log("Floor", response.data);
  //     console.log("Floor", activeFlats.flat.buildingId);
  //     setFlatList(activeFlats);
  //   } catch (error) {
  //     console.log(error);
  //     console.log('Something went wrong');
  //   }
  // };


  useEffect(() => {
    getSingleFlatResidents();
    // getAllBuildings();
    // getAllFloors();
    // getAllFlats();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryEmail,
    searchQueryPhone])


    const handleFilterChange = () => {
      setPage(0);
    };
  
    useEffect(() => {
      handleFilterChange();
    }, [ searchQueryName,
      searchQueryEmail,
      searchQueryPhone]);


  // Add Building
  const handleAddResident = async (formData: any) => {

    try {
      const { name, email, phoneNumber, type, isChild, flatId } = formData;
      const newData = {
        name,
        email,
        phoneNumber,
        type,
        isChild,
        flatId: parseInt(flatId),
        isActive: true,
      };

      const { data: responseData } = await axios.post(`${apiUrl}/societies/1/residents`, newData,
        {
          withCredentials: true,

        },)
      if (responseData) {
        setIsAddModalOpen(false);
        getSingleFlatResidents();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")

    }
  }



  //Resident Update CloseModal


  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getSingleFlatResidents()
  };

  const handleSearchEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryEmail(event.target.value);
    getSingleFlatResidents();
  };

  const handleSearchPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryPhone(event.target.value);
    getSingleFlatResidents();
  };


  //Building Update OpenModal

  const handleEditClick = (residentId: number) => {
    const selectedResident: Resident | undefined = activeFlatResidents.find(
      (resident) => resident.id === residentId
    );

    if (selectedResident) {
      setEditData(selectedResident)
      setSelectedResidentId(residentId);
      setIsEditModalOpen(true);
    }
  };



  // Function to open the delete confirmation modal
  const openDeleteModal = (residentId: number) => {
    setResidentToDeleteId(residentId);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setResidentToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value);
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage)
    getSingleFlatResidents();
  };


  // Edit Flat

  const handleUpdate = async (updateData: AddResident) => {
    try {
      // const { isChild } = data;
      // const updatedData = {
      //   name: getValues('name'),
      //   type: getValues('type'),
      //   email: getValues('email'),
      //   phoneNumber: getValues('phoneNumber'),
      //   isChild,
      //   flatId: parseInt(getValues('flatId')),
      //   isActive: true,
      // };
      const response = await axios.put(
        `${apiUrl}/societies/1/residents/${selectedResidentId}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },

      );

      console.log(response.data);

      if (response.data) {
        console.log('Building Name Updated Successfully');
        // navigate(`/residentlist`);
        getSingleFlatResidents();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
    }
  };

  //delete a Flat

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/1/residents/${Id}/false`, null, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Resident DeActive successfully')
      getSingleFlatResidents();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong")
    }
  }


  const breadcrumbs = [
    {
      to: '/home',
      label: 'Home',
    },
    {
      label: 'Residentlist',
    },
  ];

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>

          <Box className={styles['btn_container']}>
            <h1>Resident List</h1>
            <Box>
              <AddResidentComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddResident}
              />
            </Box>
            <Button variant="contained" color="primary"
              onClick={() => {
                //  openAddModal() 
                resetForm();
                setIsAddModalOpen(true)
              }}
            > Add New Resident</Button>
          </Box >

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Email
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Phone Number
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="standard"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNameChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }}
                      />
                    </Box></TableCell>
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="standard"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchEmailChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="standard"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchPhoneNumberChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(activeFlatResidents) && activeFlatResidents.length > 0 ? (
                  activeFlatResidents.map((resident: Resident, index: number) => (
                    <TableRow key={index}>
                      <TableCell align='center' >{resident.name}
                      </TableCell>
                      <TableCell align='center' >{resident.email}
                      </TableCell>
                      <TableCell align='center' >{resident.phoneNumber}
                      </TableCell>
                      <TableCell align='center'>
                        <EditIcon sx={{ mr: 1 }} className="btn btn-primary" onClick={() => handleEditClick(resident.id)}>
                          Edit
                        </EditIcon>
                        <DeleteIcon sx={{ ml: 1 }} className="btn btn-danger" color="error" onClick={() =>
                          // handleDelete(building.id)
                          openDeleteModal(resident.id)
                        }>
                          Delete
                        </DeleteIcon>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={5}>No Resident found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ marginTop: "30px" }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>


        <EditResidentComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteResidentComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(ResidentToDeleteId);
            closeDeleteModal();
          }}
        />
      </Box >

    </>
  );
}

export default ListResidents;
