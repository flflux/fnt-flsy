import { Box, Button, Modal } from '@mui/material';
import styles from './import.module.scss';
import { useContext, useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import { SocietyContext } from '../../contexts/user-context';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ViewFlat } from '@fnt-flsy/data-transfer-types';

/* eslint-disable-next-line */
export interface ImportProps {
  open: boolean;
  onClose: () => void;
}

export function Import({ open, onClose }: ImportProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [importType, setImportType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [activeBuildingFlats, setActiveBuildingFlats] = useState<ViewFlat[]>([]);

  const societycontext = useContext(SocietyContext);
  console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);

  const apiUrl = environment.apiUrl;

  useEffect(() => {
    getSingleBuildingFlats();
  }, []);

  const getSingleBuildingFlats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/flats`, {
        withCredentials: true,
      });

      const { content, total } = response.data;
      setActiveBuildingFlats(content);

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
    }
  };



  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // document.getElementById('excel-file-input')?.click();

    if (!file) {
      return;
    }
    setSelectedFile(file);
    uploadFileToAPI(file, importType);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setImportType('');
    setSelectedFile(null); // Reset selectedFile
    setShowFileInput(false); // Reset showFileInput
  };

  const openFileInput = () => {
    document.getElementById('excel-file-input')?.click();
    console.log("input clicked!");
    setModalOpen(false);
  };

  const handleImportType = (type: string) => {
    console.log("type selected")
    if (type !== null) {
      openFileInput();
      setImportType(type);
    } else {
      console.error('No file selected');
    }
  };

  const uploadFileToAPI = async (file: File | null, importType: string) => {
    if (!file) {
      console.error('No file selected');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      let apiUrls;
      // Set the API URL based on the import type
      switch (importType) {
        case 'flats':
          apiUrls = `${apiUrl}/societies/${societycontext?.id}/flats/bulkupload`;
          break;
        case 'residents':
          apiUrls = `${apiUrl}/societies/${societycontext?.id}/residents/bulkupload`;
          break;
        case 'vehicles':
          apiUrls = `${apiUrl}/societies/${societycontext?.id}/vehicles/bulkupload`;
          break;
        default:
          console.error('Invalid import type');
          return;
      }
      const response = await axios.post(apiUrls, formData, {
        withCredentials: true,
      });
      if (response) {
        enqueueSnackbar("Excel file uploaded successfully!", { variant: 'success' });
        onClose();
        getSingleBuildingFlats();
        console.log('API response:', response);
        if (response.data.errors && response.data.errors.length > 0) {
          exportErrorsToExcel(response.data.errors);
        }
      } else {
        console.log('Error uploading file');
        enqueueSnackbar("Error uploading file!", { variant: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file to API', error);
      enqueueSnackbar("Error uploading file!", { variant: 'error' });
    }
  };

  // Function to export errors to Excel
  const exportErrorsToExcel = (errors: any[]) => {
    // Convert errors array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(errors);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

    // Write the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Trigger the download
    saveAs(data, 'upload_errors.xlsx');
  };

  return (
    <><input
      type="file"
      id="excel-file-input"
      accept=".xls, .xlsx"
      style={{ display: 'none' }}
      onChange={handleImport} />
      <Modal open={open} onClose={onClose}>
        <Box className={styles['modal-container']}>
          <div>
            <h2>Select Import Type</h2>
            <Button color="info" variant="contained" onClick={() => handleImportType('flats')}>Import Flats</Button>
            <Button color="info" variant="contained" onClick={() => handleImportType('residents')}>Import Residents</Button>
            <Button color="info" variant="contained" onClick={() => handleImportType('vehicles')}>Import Vehicles</Button>
            {/* </div> */}
          </div>
        </Box>
      </Modal></>
  );
}

export default Import;
