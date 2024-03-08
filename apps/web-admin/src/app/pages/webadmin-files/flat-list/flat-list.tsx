/* eslint-disable react/jsx-no-useless-fragment */
import styles from './flat-list.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { AddFlat, Flat } from '@fnt-flsy/data-transfer-types';
import AddFlatComponent from './add-flat/add-flat';
import EditFlatComponent from './edit-flat/edit-flat';
import DeleteFlatComponent from './delete-flat/delete-flat';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListFlatsProps {
}

export function ListFlats(props: ListFlatsProps) {
  const apiUrl = environment.apiUrl;
  const [activeBuildingFlats, setActiveBuildingFlats] = useState<Flat[]>([]);
  const params = useParams();

  const { reset: resetForm } = useForm({
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryBuildingName, setSearchQueryBuildingName] = useState<string>('');
  const [searchQueryFloorNumber, setSearchQueryFloorNumber] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<number | null>(null)
  const [editData, setEditData] = useState<AddFlat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const getSingleBuildingFlats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/flats`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          number: searchQueryName,
          name: searchQueryBuildingName,
          floorNumber: searchQueryFloorNumber,
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveBuildingFlats(content);

      const buildingFlats = response.data.content;
      const filteredBuildingFlats = buildingFlats.filter(
        (flat: { id: number; number: string; isActive: boolean; floor: { id: any; number: string; building: { id: any; name: string } } }) =>
          flat.isActive === true
      );
      setActiveBuildingFlats(filteredBuildingFlats);
      console.log(params.id)
      console.log(filteredBuildingFlats)

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    getSingleBuildingFlats();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryBuildingName,
    searchQueryFloorNumber])

  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName,
    searchQueryBuildingName,
    searchQueryFloorNumber]);

  // Add Building
  const handleAddFlat = async (formData: AddFlat) => {
    try {
      const { data } = await axios.post(`${apiUrl}/flats`, formData,
        {
          withCredentials: true,
        },)
      if (data) {
        setIsAddModalOpen(false);
        getSingleBuildingFlats();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")

    }
  }

  // Function to open the delete confirmation modal
  const openDeleteModal = (VehicleId: number) => {
    setVehicleToDeleteId(VehicleId);
    console.log("VehicleToDeleteId:", VehicleToDeleteId);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setVehicleToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Building Update OpenModal

  const handleEditClick = (FlatId: number) => {
    const selectedFlat: Flat | undefined = activeBuildingFlats.find(
      (Flat) => Flat.id === FlatId
    );

    if (selectedFlat) {
      setEditData(selectedFlat)
      setSelectedFlatId(FlatId);
      console.log(FlatId)
      setIsEditModalOpen(true);
    }
  };


  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getSingleBuildingFlats();
  };

  const handleSearchBuildingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryBuildingName(event.target.value);
    getSingleBuildingFlats();
  };

  const handleSearchFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryFloorNumber(event.target.value);
    getSingleBuildingFlats();
  };



  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };


  // Edit Flat

  const handleUpdate = async (data: AddFlat) => {
    try {
      const response = await axios.put(
        `${apiUrl}/flats/${selectedFlatId}`,
        data,
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
        // navigate(`/buildinglist/${params.id}`);
        getSingleBuildingFlats();
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
      const { data } = await axios.post(`${apiUrl}/flats/${Id}/false`, null, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Flat DeActive successfully')
      getSingleBuildingFlats();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong")
    }
  }


  const breadcrumbs = [
    {
      to: '/societylist',
      label: 'Societies',
    },
    // {
    //   to:"/societies/:id",
    //   label:`${societyname}`
    // },
    {
      label: 'Flatlist',
    },
  ];

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>
          <Box className={styles['btn_container']}>
            <h1>Flat List </h1>
            <Box>
              <AddFlatComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddFlat}
              />
            </Box>
            <Button variant="contained" color="primary"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true)
              }}
            > Add New Flat</Button>
          </Box >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ border: "hidden", fontFamily: "Poppins" }}>Number
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Building Name
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Floor Number
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}></TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                <TableRow >
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        sx={{ borderRadius: "10px" }}
                        type="text"
                        variant="outlined"
                        size="small"
                        onChange={handleSearchNameChange}
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
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchBuildingChange}
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
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchFloorChange}
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
                {Array.isArray(activeBuildingFlats) && activeBuildingFlats.length > 0 ? (
                  activeBuildingFlats.map((flat: Flat, index: number) => (
                    <TableRow key={index}>
                      <TableCell align='center' >
                        {flat.number}
                      </TableCell>
                      <TableCell align='center' >
                        {flat.floor.building.name}
                      </TableCell>
                      <TableCell align='center' >
                        {flat.floor.number}
                      </TableCell>
                      <TableCell align='center'>
                        <EditIcon sx={{ mr: 1 }} className="btn btn-primary" onClick={() => handleEditClick(flat.id)}>
                          Edit
                        </EditIcon>
                        <DeleteIcon sx={{ ml: 1 }} className="btn btn-danger" color="error" onClick={() =>
                          // handleDelete(building.id)
                          openDeleteModal(flat.id)
                        }>
                          Delete
                        </DeleteIcon>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={5}>No Flat found</TableCell>
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

        </Box >

        <EditFlatComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteFlatComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(VehicleToDeleteId);
            closeDeleteModal();
          }}
        />
      </Box >
    </>
  );
}

export default ListFlats;
