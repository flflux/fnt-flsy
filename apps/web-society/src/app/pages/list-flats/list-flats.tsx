/* eslint-disable react/jsx-no-useless-fragment */
import styles from './list-flats.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, InputLabel, Checkbox, CircularProgress, IconButton, Stack, Pagination, PaginationItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { AddFlat, Flat, ViewFlat } from '@fnt-flsy/data-transfer-types';
import AddFlatComponent from './add-flats/add-flats';
import EditFlatComponent from './edit-flats/edit-flats';
import DeleteFlatComponent from './delete-flats/delete-flats';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext, UserContext } from "../../contexts/user-context";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListFlatsProps {
}

interface Form {
  buildingId: number;
  floorId: number;
  number: string;
}



export function ListFlats(props: ListFlatsProps) {
  const apiUrl = environment.apiUrl;
  const [activeBuildingFlats, setActiveBuildingFlats] = useState<ViewFlat[]>([]);
  const params = useParams();
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
  const [flatToDeleteId, setflatToDeleteId] = useState<{ id: number, buildingId: number, floorId: number } | null>(null)
  const [editData, setEditData] = useState<ViewFlat | null>(null);
  const [deleteData, setDeleteData] = useState<ViewFlat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  


  const { enqueueSnackbar } = useSnackbar();
  const user = useContext(UserContext);

  const buildingIds: number[] = [];
  const floorIds: number[] = [];

  const societycontext = useContext(SocietyContext);
  console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);


  const navigate = useNavigate();

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName,
    searchQueryBuildingName,
    searchQueryFloorNumber, user, societycontext]);

  const getSingleBuildingFlats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/flats`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          number: searchQueryName,
          name: searchQueryName,
          floorNumber: searchQueryName
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveBuildingFlats(content);


      response.data.content.forEach((item: { floor: { building: { id: number; }; }; id: number; }) => {
        if (item.floor && item.floor.building) {
          buildingIds.push(item.floor.building.id);
        }
        if (item.id) {
          floorIds.push(item.id);
        }
      });

      // Now you have separate arrays for building IDs and floor IDs
      console.log("Building IDs:", buildingIds);
      console.log("Floor IDs:", floorIds);

      console.log("flat list:",response.data);
      console.log("id:", params.id)
      console.log(params.floorNumber);
      setLoading(false);

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleBuildingFlats();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryBuildingName,
    searchQueryFloorNumber, user, societycontext])

  const handleFilterChange = () => {
    setPage(0);
  };



  // Add Flat
  const handleAddFlat = async (formData: {
    buildingId: number;
    floorId: number;
    number: string;
  }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flats`,
        { number: formData.number },
        {
          withCredentials: true,
        },)
      if (data) {
        setIsAddModalOpen(false);
        getSingleBuildingFlats();
        enqueueSnackbar("Flat added successfully!", { variant: 'success' });

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
    }
  }

  // Function to open the delete confirmation modal
  const openDeleteModal = (flat: { id: number, buildingId: number, floorId: number }) => {
    const selectedFlat: ViewFlat | undefined = activeBuildingFlats.find(
      (Flat) => Flat.id === flat.id
    );

    if (selectedFlat) {
      setDeleteData(selectedFlat);
      setflatToDeleteId(flat);
      console.log("flatToDeleteId:", flatToDeleteId);
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setflatToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Building Update OpenModal
  const handleEditClick = (FlatId: number) => {
    const selectedFlat: ViewFlat | undefined = activeBuildingFlats.find(
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

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);


  // Edit Flat
  const handleUpdate = async (formData: {
    buildingId: number;
    floorId: number;
    number: string;
  }) => {
    try {
      console.log(editData);
      const response = await axios.put(
        `${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flats/${selectedFlatId}`,
        { number: formData.number },
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
        enqueueSnackbar("Building name updated successfully!", { variant: 'success' });
        // navigate(`/buildinglist/${params.id}`);
        getSingleBuildingFlats();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
        enqueueSnackbar("Error in updation !", { variant: 'error' });
      }

    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
    }
  };

  //delete a Flat

  const handleDelete = async (flat: { id: number, buildingId: number, floorId: number } | null) => {
    if (flat == null) return;
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/buildings/${flat.buildingId}/floors/${flat.floorId}/flats/${flat.id}`, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Flat DeActive successfully');
      enqueueSnackbar("Flat deleted successfully!", { variant: 'success' });
      getSingleBuildingFlats();
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      enqueueSnackbar("Error in Deletion!", { variant: 'error' });
    }
  }

  function handleRowClick(flatId: number, floorId: number, buildingId: number, event: React.MouseEvent<HTMLTableRowElement>) {
    // Check if the click event originated from an action button
    if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
      return;
    }
    navigate(`/societies/${societycontext?.id}/buildings/${buildingId}/floors/${floorId}/flats/${flatId}`);
  }

  const handleCheckboxChange = (FlatId: number) => {
    const isSelected = selectedItems.includes(FlatId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== FlatId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, FlatId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activeBuildingFlats.every((Flat) =>
      selectedItems.includes(Flat.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allFlatIds = activeBuildingFlats.map((Flat) => Flat.id);
      setSelectedItems(allFlatIds);
    }
  };




  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },

    {
      label: 'Flats',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>
          <Box className={styles['btn_container']}>
            <h1>Flats</h1>
            <Box>
              <AddFlatComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddFlat}
              />
            </Box>
            <Box className={styles['search-container']}>
              <TextField
                type="text"
                variant="outlined"
                size="small"
                sx={{ mt: '17px', mr: '10px' }}
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box>

          </Box >
          <TableContainer className={styles['table_container']}>
            <Table stickyHeader>
              <TableHead className={styles['table_head']}>
                <TableRow>
                  <TableCell><Checkbox
                    {...label}
                    checked={
                      activeBuildingFlats.length > 0 &&
                      activeBuildingFlats.every((Flat) =>
                        selectedItems.includes(Flat.id)
                      )
                    }
                    onChange={handleHeaderCheckboxChange}
                  /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Building
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Floor
                  </TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Flat
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                <TableRow
                //    sx={{
                //   position:"sticky",
                //   top: 56,
                //   backgroundColor:"white",
                // }}
                >
                </TableRow>
                {loading ? (
                  <TableCell align='center' colSpan={5}>
                    <CircularProgress />
                  </TableCell>
                ) : (Array.isArray(activeBuildingFlats) && activeBuildingFlats.length > 0 ? (
                  activeBuildingFlats.map((flat: ViewFlat, index: number) => (
                    <TableRow className={styles['table-row']} onClick={(e) => handleRowClick(flat.id, flat.floor.id, flat.floor.building.id, e)}>
                      <TableCell><Checkbox
                        checked={selectedItems.includes(flat.id)}
                        onChange={() => handleCheckboxChange(flat.id)}
                        {...label}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      /></TableCell>
                      <TableCell>
                        {flat.floor.building.name}
                      </TableCell>
                      <TableCell>
                        {flat.floor.number}
                      </TableCell>
                      <TableCell>
                        {flat.number}
                      </TableCell>
                      <TableCell >
                        <IconButton classes="btn btn-primary action-button" className={styles['row-action-button']} onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(flat.id);
                          }} sx={{color:'black'}}>
                          <EditIcon>
                            Edit
                          </EditIcon>
                        </IconButton>
                       
                       <IconButton classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                            // handleDelete(building.id)
                            e.stopPropagation();
                            openDeleteModal({ id: flat.id, buildingId: flat.floor.building.id, floorId: flat.floor.id })
                          }}>
                        <DeleteIcon>
                            Delete
                          </DeleteIcon>
                       </IconButton>
                        
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={5}>No Flat found</TableCell>
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
              className={styles['pagination']}
              sx={{ marginTop: "5px" }}
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
            handleDelete(flatToDeleteId);
            closeDeleteModal();
          }}
          flatData={deleteData}
        />
      </Box >
    </>
  );
}

export default ListFlats;
