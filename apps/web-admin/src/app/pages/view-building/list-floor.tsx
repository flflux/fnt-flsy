/* eslint-disable react/jsx-no-useless-fragment */
import styles from './list-floor.module.scss';
import { environment } from '../../../environments/environment';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, Checkbox, CircularProgress, IconButton, Stack, Pagination, PaginationItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ViewFloor } from '@fnt-flsy/data-transfer-types';
import AddFloorComponent from './add-floor/add-floors';
import EditFloorComponent from './edit-floor/edit-floors';
import DeleteFloorComponent from './delete-floor/delete-floors';
import { enqueueSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext } from '../../contexts/user-contexts';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListFloorProps {
}

interface Form {
  buildingId: number;
  number: string;
}


export function ListFloor(props: ListFloorProps) {
  const apiUrl = environment.apiUrl;
  const params = useParams()
  const [activeFloors, setActiveFloors] = useState<ViewFloor[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryFloorNumber, setSearchQueryFloorNumber] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<{ id: number, buildingId: number } | null>(null)
  const [editData, setEditData] = useState<ViewFloor | null>(null);
  const [deleteData, setDeleteData] = useState<ViewFloor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [data, setData] = useState<ViewFloor | null>(null);
  const [buildingName, setBuildingName] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);


  const societyContext=useContext(SocietyContext);
  //console.log("society context on Floor View:",societyContext);
  console.log("society id:",societyContext?.id);
  console.log(params?.societyId);

  const getFloors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings/${params.id}/floors`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryFloorNumber
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setData(content);
      // console.log(response.data.content)
      const Floors = response.data.content;

      const floor = content.map((floor: any) => ({
        id: floor.id,
        number: floor.number,
        building: {
          id: floor.building.id,
          name: floor.building.name,
        },
      }));
      console.log(floor)
      setActiveFloors(Floors);
      console.log(params.id)
      console.log(Floors)
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoading(false);
    }
  };


  useEffect(() => {
    getFloors();
  }, [page, rowsPerPage,
    searchQueryFloorNumber])


  //Handle Search All Pages
  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryFloorNumber]);



  // Function to open the delete confirmation modal
  const openDeleteModal = (floor: { id: number, buildingId: number }) => {
    const selectedFloor: ViewFloor | undefined = activeFloors.find(
      (Floor) => Floor.id === floor.id
    );
    if (selectedFloor) {
      setDeleteData(selectedFloor);
    setVehicleToDeleteId(floor);
    console.log("VehicleToDeleteId:", VehicleToDeleteId);
    setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setVehicleToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  //Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Building Update OpenModal
  const handleEditClick = (FloorId: number) => {
    const selectedFloor: ViewFloor | undefined = activeFloors.find(
      (Floor) => Floor.id === FloorId
    );

    if (selectedFloor) {
      setEditData(selectedFloor)
      setSelectedFloorId(FloorId);
      console.log(FloorId)
      setIsEditModalOpen(true);
    }
  };


  //Search Function
  const handleSearchFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryFloorNumber(event.target.value);
    getFloors();
  };


  //Pagination
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

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  // Add Floor
  const handleAddFloor = async (formData: Form) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${params.societyId}/buildings/${formData.buildingId}/floors`, { number: formData.number },
        {
          withCredentials: true,
        },)
      if (data) {
        enqueueSnackbar('Floor added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getFloors();
      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });

    }
  }

  // Edit Floor
  const handleUpdate = async (data: Form) => {
    try {
      const response = await axios.put(
        `${apiUrl}/societies/${params.societyId}/buildings/${data.buildingId}/floors/${selectedFloorId}`,
        { number: data.number },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },
      );
      console.log(response.data);

      if (response.data) {
        console.log('Floor Updated Successfully');
        enqueueSnackbar('Floor updated successfully', { variant: 'success' });
        getFloors();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };


  //delete a Floor
  const handleDelete = async (floor: { id: number, buildingId: number } | null) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${params.societyId}/buildings/${floor?.buildingId}/floors/${floor?.id}`, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Floor Deleted successfully')
      enqueueSnackbar('Floor deleted successfully', { variant: 'success' });
      getFloors();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            const errorResponseData = axiosError.response.data as { message: string };
            console.log('Error message:', errorResponseData.message);
            enqueueSnackbar(`Error: ${errorResponseData.message}`, { variant: 'error' });
          } else {
            console.log('Request failed with status code 400:', axiosError.response.data);
            enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
          }
        } else {
          console.log('Request failed with status code 400');
          enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
        }
      } else {
        console.log('Something went wrong');
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    }

  }


  useEffect(() => {
    const getBuildingDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings/${params.id}`, {
          withCredentials: true,
        });


        if (response.data) {
          setBuildingName(response.data.name);
          setBuildingId(response.data.id)
        }
      } catch (error) {
        console.log(error);
        console.log("Something went wrong while fetching building details");
      }
    };

    getBuildingDetails();
  }, [params.societyId]);

  const handleCheckboxChange = (floorId: number) => {
    const isSelected = selectedItems.includes(floorId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== floorId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, floorId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activeFloors.every((floors) =>
      selectedItems.includes(floors.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allFloorIds = activeFloors.map((floors) => floors.id);
      setSelectedItems(allFloorIds);
    }
  };


  //BreadCrumbs
  const breadcrumbs = [
    {
      to: '/societies',
      label: 'Societies',
    },
    {
      to: `/societies/${societyContext?.id}`,
      label: `${societyContext?.name}`
    },
    {
      to: `/societies/${societyContext?.id}/buildinglist`,
      label: "Buildings",
    },
    {
      label: `${buildingName}`,
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>
          <Box className={styles['btn_container']}>
            <h1>{buildingName}</h1>
            <Box>
              <AddFloorComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddFloor}
                buildingId={buildingId}
              />
            </Box>
            <Box className={styles['search-container']}>
              <TextField
                type="text"
                sx={{ mt: 2.3, mr: '10px' }}
                variant="outlined"
                size="small"
                onChange={handleSearchFloorChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true)
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box>

          </Box >
          <TableContainer sx={{
            // maxHeight: 475,
            // position: 'relative',
            // '&::-webkit-scrollbar': {
            //   display: 'none',
            // },
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    activeFloors.length > 0 &&
                    activeFloors.every((floor) =>
                      selectedItems.includes(floor.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Floor Number
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Building Name
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{
                  position: "sticky",
                  top: 56,
                  backgroundColor: "white",
                }}>
                  {/* <TableCell >

                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell> */}
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={5}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(activeFloors) && activeFloors.length > 0 ? (
                  activeFloors.map((floor: ViewFloor) => (
                    <TableRow >
                      <TableCell><Checkbox
                      checked={selectedItems.includes(floor.id)}
                      onChange={() => handleCheckboxChange(floor.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                      <TableCell  >
                        {floor.number}
                      </TableCell>
                      <TableCell  >
                        {floor.building.name}
                      </TableCell>
                      <TableCell >
                      <IconButton onClick={() => handleEditClick(floor.id)}
                           sx={{ color:'black'}}>
                        <EditIcon ></EditIcon>
                      </IconButton>
                      <IconButton color="error" onClick={() =>
                          openDeleteModal({ id: floor.id, buildingId: floor.building.id })
                        }>
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }} colSpan={5}>No Floor found</TableCell>
                  </TableRow>
                )
                )}
              </TableBody>
            </Table>
            <Box sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}>
          <Stack sx={{marginBottom:"15px", marginRight:"20px", marginTop: "30px",}} spacing={2}>
            <Pagination
            sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}
              count={pageCount > pageCountThreshold ? pageCount + 1 : pageCount}
              page={page + 1}
              onChange={(event, value) => handleChangePage(event, value - 1)}

              renderItem={(item) => (
                <PaginationItem
                  component="div"
                  sx={{
                 
                    marginLeft: "5px",
                  
                  }}
                 
                  {...item}
                />
              )}
            />
          </Stack>
            <TablePagination
              sx={{
                position: 'sticky',
                bottom: 0,
                marginTop: '5px',
                background: 'white',
              }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Box>
          </TableContainer>

        </Box >

        <EditFloorComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteFloorComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(VehicleToDeleteId);
            closeDeleteModal();
          }}
          floorData={deleteData}
        />
      </Box >
    </>
  );
}

export default ListFloor;
