import styles from './list-societies.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, Select, MenuItem, InputLabel, FormControl, FormHelperText, Checkbox, CircularProgress, Pagination, PaginationItem, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
// import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Society, ViewSociety } from '@fnt-flsy/data-transfer-types';
import CustomBreadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import AddSocietyComponent from './add-society/add-society';
import DeleteSocietyComponent from './delete-society/delete-society';
import EditSocietyComponent from './edit-society/edit-society';
import AddIcon from '@mui/icons-material/Add';
import { enqueueSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export interface AddSociety {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
}

/* eslint-disable-next-line */
export interface ListSocietiesProps { }

export function ListSocieties(props: ListSocietiesProps) {
  const apiUrl = environment.apiUrl;
  const [activeSocieties, setActiveSocieties] = useState<ViewSociety[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryCity, setSearchQueryCity] = useState<string>('');
  const [searchQueryStateCode, setSearchQueryStateCode] = useState<string>('');
  const [searchQueryCountryCode, setSearchQueryCountryCode] = useState<string>('');
  const [searchQueryPostalCode, setSearchQueryPostalCode] = useState<string>('');
  const navigate = useNavigate();
  const [actives, setActives] = useState<boolean>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSocietyId, setSelectedSocietyId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SocietyToDeleteId, setSocietyToDeleteId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [editData, setEditData] = useState<ViewSociety | null>(null);
  const [deleteData, setDeleteData] = useState<ViewSociety | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const getSocieties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
          city: searchQueryCity,
          stateCode: searchQueryStateCode,
          countryCode: searchQueryCountryCode,
          postalCode: searchQueryPostalCode,
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveSocieties(content);
      console.log(content)
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSocieties();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryCity,
    searchQueryStateCode,
    searchQueryPostalCode,
    searchQueryCountryCode,
  ])



  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName,
    searchQueryCity,
    searchQueryStateCode,
    searchQueryPostalCode,
    searchQueryCountryCode,]);

  // Add Building

  const handleAddSociety = async (newData: AddSociety) => {
    try {
      const { data: responseData } = await axios.post(`${apiUrl}/societies`, newData,
        {
          withCredentials: true,

        },)
      if (responseData) {
        enqueueSnackbar("Society added successfully!", { variant: 'success' });
        setIsAddModalOpen(false);
        getSocieties();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", { variant: 'error' });
      console.log("Something went wrong in input form")

    }
  }



  //Building Update CloseModal

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSocietyId(null);
  };


  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedSocietyId(null);
  };


  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getSocieties()
  };

  const handleSearchCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryCity(event.target.value);
    getSocieties();
  };

  const handleSearchStateCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryStateCode(event.target.value);
    getSocieties();
  };
  const handleSearchCountryCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryCountryCode(event.target.value);
    getSocieties();
  };
  const handleSearchPostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryPostalCode(event.target.value);
    getSocieties();
  };


  //Building Update OpenModal

  const handleEditClick = (societyId: number) => {
    const selectedSociety: ViewSociety | undefined = activeSocieties.find(
      (society) => society.id === societyId
    );

    if (selectedSociety) {
      setEditData(selectedSociety)
      console.log(selectedSociety)
      setSelectedSocietyId(societyId);
      navigate
        (`/societies/${societyId}/edit`)
    }
  };



  // Function to open the delete confirmation modal
  const openDeleteModal = (societyId: number) => {
    const selectedSociety: ViewSociety | undefined = activeSocieties.find(
      (society) => society.id === societyId
    );

    if (selectedSociety) {
      setSocietyToDeleteId(societyId);
      setDeleteData(selectedSociety)
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setSocietyToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value,
      // activeBuildingFlats.length
    );
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage)
    getSocieties();
  };

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);



  // Edit Society

  const handleUpdate = async (updatedData: AddSociety) => {
    try {
      const response = await axios.put(
        `${apiUrl}/societies/${selectedSocietyId}`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },

      );

      console.log(response.data);

      if (response.data) {
        console.log('Society Updated Successfully');
        enqueueSnackbar("Society updated successfully!", { variant: 'success' });
        getSocieties();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Something went wrong", { variant: 'error' });
      console.log('Something went wrong');
    }
  };

  //delete Society

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${Id}`, {
        withCredentials: true,
      });
      console.log(data);
      enqueueSnackbar("Society deleted successfully!", { variant: 'success' });
      console.log('Society DeActive successfully')
      getSocieties();
    } catch (error) {
      console.log(error)
      enqueueSnackbar("Something went wrong", { variant: 'error' });
      console.log("Something went wrong")
    }
  }

  const handleCheckboxChange = (societyId: number) => {
    const isSelected = selectedItems.includes(societyId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== societyId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, societyId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    const allSelected = activeSocieties.every((society) =>
      selectedItems.includes(society.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allSocietyIds = activeSocieties.map((society) => society.id);
      setSelectedItems(allSocietyIds);
    }
  };

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

      const response = await axios.post(`${apiUrl}/societies/bulkupload`, formData, {
        withCredentials: true,
      });
      if (response) {
        enqueueSnackbar("Excel file successfully!", { variant: 'success' });
        getSocieties();
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

  // const handleExport = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/societies`, {
  //       withCredentials: true});
  //     const societiesData = response.data.content;

  //     const exportData = convertDataToCSV(societiesData);

  //     const blob = new Blob([exportData], { type: 'text/csv' });

  //     const a = document.createElement('a');
  //     a.href = URL.createObjectURL(blob);
  //     a.download = 'exported_data.csv';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error('Error fetching data from API:', error);
  //   }
  // };

  // const convertDataToCSV = (data: Record<string, string>[]) => {
  //   if (!data.length) {
  //     return '';
  //   }
  //   const header = Object.keys(data[0]).join(',') + '\n';
  //   const rows = data.map((row) => Object.values(row).join(',') + '\n');
  //   return header + rows.join('');
  // };


  const handleExport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies`, {
        withCredentials: true
      });
      const societiesData = response.data.content;
      const excludedFields = ['id', 'isActive'];
      const exportData = convertDataToExcel(societiesData, excludedFields);

      const blob = new Blob([exportData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'exported_society_data.xlsx';
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


  const breadcrumbs = [
    // {
    //   to: '/home',
    //   label: 'Home',
    // },
    {
      label: 'Societies',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

 

  return (
    <Box className={styles['container']}>
      <CustomBreadcrumbs paths={breadcrumbs} />
      <Box className={styles['building_container']}>

        <Box className={styles['btn_container']}>
          <h1>Societies</h1>
          <Box>
            {/* <AddSocietyComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddSociety}
            /> */}
          </Box>
          <Box className={styles['search-container']}>
            <Button
              startIcon={<FileUploadIcon />}
              color="info"
              variant="contained"
              onClick={handleExport}
            >
              Export
            </Button>
            <input
              type="file"
              id="excel-file-input"
              accept=".xls, .xlsx"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
            <Button
              startIcon={<DownloadIcon />}
              color="info"
              variant="contained"
              onClick={() => document.getElementById('excel-file-input')?.click()}
            >
              Import
            </Button>
            <TextField
              type="text"
              // label="Search by Society Name"
              sx={{ mt: 2.3, mr: "10px" }}
              variant="outlined"
              size="small"
              onChange={handleSearchNameChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon color="action" />
                ),
              }}
            />
            <Button variant="contained" color="primary"
              onClick={() => navigate('/societies/add')}
            ><AddIcon fontSize="small" /> Add</Button>
          </Box>

        </Box >

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    activeSocieties.length > 0 &&
                    activeSocieties.every((soceity) =>
                      selectedItems.includes(soceity.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                <TableCell align='center'>Name
                </TableCell>
                <TableCell align='center'>Address
                </TableCell>
                <TableCell align='center'>City
                </TableCell>
                <TableCell align='center'>State
                </TableCell>
                <TableCell align='center'>Country
                </TableCell>
                <TableCell align='center'>Postal Code
                </TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
              </TableRow>
              {loading ? (
                <TableCell align='center' colSpan={8}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(activeSocieties) && activeSocieties.length > 0 ? (
                activeSocieties.map((society: ViewSociety, index: number) => (
                  <TableRow key={index}>
                    <TableCell><Checkbox
                      checked={selectedItems.includes(society.id)}
                      onChange={() => handleCheckboxChange(society.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                    <TableCell align='center'>
                      <NavLink to={`/societies/${society.id}`} className={styles['socname']}>
                        {society.name}
                      </NavLink>
                    </TableCell>
                    <TableCell align='center' >{society.addressLine1}, {society.addressLine2}

                    </TableCell>

                    <TableCell align='center' >{society.city}

                    </TableCell>
                    <TableCell align='center' >{society.stateCode}

                    </TableCell>
                    <TableCell align='center' >{society.countryCode}

                    </TableCell>
                    <TableCell align='center' >{society.postalCode}

                    </TableCell>
                    <TableCell sx={{ minWidth: 70 }}  >
                      <IconButton aria-label="edit" sx={{ color: "black" }} onClick={() => handleEditClick(society.id)}>
                        <EditIcon>
                          {/* Edit */}
                        </EditIcon>
                      </IconButton>
                      <IconButton aria-label="edit" color="error" onClick={() =>
                        // handleDelete(building.id)
                        openDeleteModal(society.id)
                      }>
                        <DeleteIcon  >
                          Delete
                        </DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align='center' colSpan={10}>No Society found</TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "flex-end",

          }}>
            <Stack sx={{ marginBottom: "15px", marginRight: "20px", marginTop: "30px", }} spacing={2}>
              <Pagination
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: "flex-end",

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

      </Box>

      {/* <EditSocietyComponent
        open={isEditModalOpen}
        onClose={closeEditModal}
        onUpdate={(data) => {
          handleUpdate(data);
          closeEditModal();
        }}
        initialData={editData}
      /> */}

      <DeleteSocietyComponent
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(SocietyToDeleteId);
          closeDeleteModal();
        }}
        societyData={deleteData}
      />
    </Box >
  );
}

export default ListSocieties;
