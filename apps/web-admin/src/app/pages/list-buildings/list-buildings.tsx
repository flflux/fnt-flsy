import { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  Pagination,
  PaginationItem,
} from '@mui/material';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import styles from './list-buildings.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { AddBuilding, Building, Society, ViewBuilding } from '@fnt-flsy/data-transfer-types';
import AddBuildingComponent from './add-building/add-building';
import EditBuildingComponent from './edit-building/edit-building';
import DeleteBuildingComponent from './delete-building/delete-building';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext } from '../../contexts/user-contexts';
import DeleteAllBuilding from './delete-all-building/delete-all-building';
import { ClassNames } from '@emotion/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
/* eslint-disable-next-line */
export interface ListBuildingsProps { }

interface Form {
  name: string;
}

export function ListBuildings(props: ListBuildingsProps) {
  const apiUrl = environment.apiUrl;
  const [buildingList, setBuildingList] = useState<ViewBuilding[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [BuildingToDeleteId, setBuildingToDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [editData, setEditData] = useState<ViewBuilding | null>(null);
  const [deleteData, setDeleteData] = useState<ViewBuilding | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [society,setSociety]=useState<Society | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  console.log("society id:",id);
  const params=useParams();
  console.log(params.societyId);

  //Get All Buildings
  const getAllBuildings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/buildings`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQuery,
        },
      });
      console.log(response.data);
      const { content, total } = response.data;
      setBuildingList(content);
      console.log(content)

      setTotalItems(total);

      const Buildings = response.data.content;
      console.log(response.data);
      setBuildingList(Buildings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  };


  const societyContext=useContext(SocietyContext);
  //console.log("society context:",societyContext);
  //console.log("society context society id:",societyContext?.id);



  useEffect(() => {
    getAllBuildings();
  }, [page, rowsPerPage, searchQuery]);


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQuery]);


  //Pagination
  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value);
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    getAllBuildings();
  };

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  //Search Function
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    getAllBuildings();
  };


  //Building Update OpenModal
  const handleEditClick = (buildingId: number) => {
    const selectedBuilding: ViewBuilding | undefined = buildingList.find(
      (building) => building.id === buildingId
    );

    if (selectedBuilding) {
      setEditData(selectedBuilding)
      setSelectedBuildingId(buildingId);
      setIsEditModalOpen(true);
    }
  };

  // //Table Row Select Function
  function handleRowClick(buildingId: number, event: React.MouseEvent<HTMLTableRowElement>) {
    if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
      return;
    }

    navigate(`/societies/${societyContext?.id}/buildinglist/${buildingId}`)
  }


  //Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  // open  delete confirmation modal
  const openDeleteModal = (buildingId: number) => {
    const selectedBuilding: ViewBuilding | undefined = buildingList.find(
      (building) => building.id === buildingId
    );

    if (selectedBuilding) {
    setDeleteData(selectedBuilding)
    setBuildingToDeleteId(buildingId);
    setIsDeleteModalOpen(true);
    }
  };

  //close delete confirmation modal
  const closeDeleteModal = () => {
    setBuildingToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // Add Building
  const handleAddBuilding = async (newData: AddBuilding) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/societies/${params.societyId}/buildings`,
        newData,
        {
          withCredentials: true,
        }
      );
      if (data) {
        enqueueSnackbar('Building added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getAllBuildings();
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      console.log('Something went wrong in input form');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };


  // Edit Building
  const handleUpdate = async (data: Form) => {
    try {
      const response = await axios.put(
        `${apiUrl}/societies/${params.societyId}/buildings/${selectedBuildingId}`,
        { name: data.name },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);

      if (response.data) {
        console.log('Building Updated Successfully');
        enqueueSnackbar('Building updated successfully', { variant: 'success' });
        getAllBuildings();
        setIsModalOpen(false);
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  //delete a Building

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.delete(
        `${apiUrl}/societies/${params.societyId}/buildings/${Id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      console.log('Building DeActive successfully');
      enqueueSnackbar('Building deleted successfully', { variant: 'success' });
      getAllBuildings();
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const openAllDeleteModal = (buildingIds: number | number[]) => {
    // If there are selected items, open the "Delete All" modal
    if (Array.isArray(buildingIds)) {
      setBuildingToDeleteId(null); // Clear individual delete ID
      setIsDeleteModalOpen(true);
    } else {
      // If no selected items, open the individual delete modal
      setBuildingToDeleteId(buildingIds);
      setIsDeleteModalOpen(true);
    }
  };

  //close delete confirmation modal
  const closeAllDeleteModal = () => {
    setBuildingToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleAllDelete = async () => {
    try {
      // Delete all selected items
      await Promise.all(
        selectedItems.map(async (buildingId) => {
          await axios.delete(
            `${apiUrl}/societies/${params.societyId}/buildings/${buildingId}`,
            {
              withCredentials: true,
            }
          );
        })
      );

      enqueueSnackbar('Buildings deleted successfully', {
        variant: 'success',
      });

      // Clear selected items and refresh the building list
      setSelectedItems([]);
      getAllBuildings();
      closeAllDeleteModal();
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const handleCheckboxChange = (buildingId: number) => {
    const isSelected = selectedItems.includes(buildingId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== buildingId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, buildingId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = buildingList.every((building) =>
      selectedItems.includes(building.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allBuildingIds = buildingList.map((building) => building.id);
      setSelectedItems(allBuildingIds);
    }
  };

  //BreadCrumbs
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
      label: 'Buildings',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  


  return (
    <Box className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box className={styles['building_container']}>
        <Box className={styles['btn_container']}>
          <h1>Buildings</h1>
          <Box>
            <AddBuildingComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddBuilding}
            />
          </Box>
          <Box
            className={styles['search-container']}
          // sx={{ paddingTop: '10px' }}
          >
            <TextField
              type="text"
              variant="outlined"
              sx={{ mt:2.3, mr:'10px' }}
              size="small"
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="action" />
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsAddModalOpen(true);
              }}
            >

              <AddIcon fontSize='small' />Add
            </Button>
          </Box>

          {/* <Box>
            {selectedItems.length > 0 && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            openAllDeleteModal(selectedItems);
                          }}
                          className={styles['Delete-all']}
                        >
                          Delete All
                        </Button>
              )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsAddModalOpen(true);
              }}
            >
              <AddIcon fontSize='small' />Add
            </Button>
          </Box> */}
        </Box>
        <TableContainer
          // sx={{
          //   maxHeight: 475,
          //   position: 'relative',
          //   '&::-webkit-scrollbar': {
          //     display: 'none',
          //   },
          // }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    buildingList.length > 0 &&
                    buildingList.every((building) =>
                      selectedItems.includes(building.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>
                    
                  </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                {/* <TableCell>

                </TableCell>
                <TableCell></TableCell> */}
              </TableRow>
              {loading ? (
                <TableCell align='center' colSpan={5}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(buildingList) && buildingList.length > 0 ? (
                buildingList.map((building: Building, index: number) => (
                  <TableRow
                    className={styles['table_row']}
                    onClick={(e) => handleRowClick(building.id, e)}
                    key={index}
                  >
                    <TableCell><Checkbox
                      checked={selectedItems.includes(building.id)}
                      onChange={() => handleCheckboxChange(building.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                    <TableCell>{building.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(building.id);
                          }} sx={{ color:'black'}}>
                        <EditIcon ></EditIcon>
                      </IconButton>
                      <IconButton color="error" onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(building.id);
                          }}>
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    No buildings found
                  </TableCell>
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
              // position: 'sticky',
              // bottom: 0,
              marginTop: '5px',
              // background: 'white',
              // width: '100%',
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
      </Box>

      <EditBuildingComponent
        open={isEditModalOpen}
        onClose={closeEditModal}
        onUpdate={(data) => {
          handleUpdate(data);
          closeEditModal();
        }}
        initialData={editData}
      />

      <DeleteBuildingComponent
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(BuildingToDeleteId);
          closeDeleteModal();
        }}
        buildingData={deleteData}
      />

      {/* <DeleteAllBuilding
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(selectedItems.length > 0 ? selectedItems : BuildingToDeleteId);
          closeDeleteModal();
        }}
      /> */}
    </Box>
  );
}

export default ListBuildings;

