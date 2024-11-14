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
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { AddBuilding, Building, ViewBuilding } from '@fnt-flsy/data-transfer-types';
import AddBuildingComponent from './add-building/add-building';
import EditBuildingComponent from './edit-building/edit-building';
import DeleteBuildingComponent from './delete-building/delete-building';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext, UserContext } from "../../contexts/user-context";
// import ImportExportIcon from '@mui/icons-material/ImportExport';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const user = useContext(UserContext);

  const societycontext = useContext(SocietyContext);
  //console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);

  //Get All Buildings
  const getAllBuildings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings`, {
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  };


  useEffect(() => {
    getAllBuildings();
  }, [page, rowsPerPage, searchQuery, user, societycontext]);


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQuery, user]);


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

    navigate(`/society/${societycontext?.id}/buildings/${buildingId}`)
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
        `${apiUrl}/societies/${societycontext?.id}/buildings`,
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
        `${apiUrl}/societies/${societycontext?.id}/buildings/${selectedBuildingId}`,
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
        `${apiUrl}/societies/${societycontext?.id}/buildings/${Id}`,
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
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      label: 'Buildings',
    },
  ];


  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    uploadFileToAPI(file);
  };

  const uploadFileToAPI = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/bulkupload`, formData, {
        withCredentials: true,
      });
      if (response) {
        enqueueSnackbar("Excel file successfully!", { variant: 'success' });
        getAllBuildings();
        console.log('API response:', response);
      } else {
        console.log("Error uploading file");
        enqueueSnackbar("Error uploading file!", { variant: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file to API', error);
      enqueueSnackbar("Error uploading file!", { variant: 'error' });
    };
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings`, {
        withCredentials: true
      });
      const societiesData = response.data.content;
      const excludedFields = ['id', 'isActive', 'society'];
      const exportData = convertDataToExcel(societiesData, excludedFields);
  
      const blob = new Blob([exportData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
  
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'exported_building_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };
  
  const convertDataToExcel = (data: Record<string, any>[], excludedFields: string[]) => {
    if (!data.length) {
      return new ArrayBuffer(0); 
    }
  
    const filteredData = data.map((row) =>
      Object.keys(row).reduce((acc, key) => {
        if (!excludedFields.includes(key)) {
          acc[key] = row[key];
        }
        return acc;
      }, {} as Record<string, any>)
    );
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
  
    const excelData: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'array',
    });
  
    return new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <Box className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box className={styles['building_container']}>
        <Box className={styles['btn_container']}>
          <h1 className={styles['h1_tag']}>Buildings</h1>
          <Box>
            <AddBuildingComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddBuilding}
            />
          </Box>
          <Box>

          </Box>
          <Box
            className={styles['search-container']}
          // sx={{ paddingTop: '10px' }}
          >
            {/* <Button startIcon={<FileUploadIcon/>}  color="info" variant='contained'>Export</Button> */}
            <Button
              startIcon={<FileUploadIcon />}
              color="info"
              variant="contained"
              onClick={handleExport}
            >
              Export
            </Button>
            {/* <Button startIcon={<DownloadIcon />} color="info" variant='contained'>Import</Button> */}
            <input
              type="file"
              id="excel-file-input"
              accept=".xls, .xlsx"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <Button
              startIcon={<DownloadIcon/>}
              color="info"
              variant="contained"
              onClick={() => document.getElementById('excel-file-input')?.click()}
            >
              Import
            </Button>
            <TextField
              type="text"
              variant="outlined"
              sx={{ marginTop: "17px", mr: "10px" }}
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
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
                    <TableCell sx={{ width: 800 }}>{building.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(building.id);
                      }} sx={{ color: 'black' }}>
                        <EditIcon></EditIcon>
                      </IconButton>

                      <IconButton className={styles['row-action-button']}
                        color="error"
                        onClick={(e) => {
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
    </Box>
  );
}

export default ListBuildings;

