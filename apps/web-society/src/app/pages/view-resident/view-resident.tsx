import styles from './view-resident.module.scss';
import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import CloseIcon from '@mui/icons-material/Close';
import { SocietyContext, UserContext } from "../../contexts/user-context";
import { CircularProgress } from '@mui/material';

export interface ViewResidentComponentProps {
  open: boolean;
  onClose: () => void;
  residentId: number | null;
  initialData: ViewResident | null;
}

interface ViewResident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean;

  flats:[
    {
    type:string;
  
  flat:{
    id:number,
    number:string;
  
  floor:{
    id:number;
    number:string;
  
  building: {
    id: number;
    name: string;
    society: { id: number; name: string };
  }}}}];

}
const ViewResidentComponent: React.FC<ViewResidentComponentProps> = ({ open, onClose, residentId, initialData }) => {
  const apiUrl = environment.apiUrl;
  const user=useContext(UserContext);
  const [viewResidents, setViewResidents] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    flats:[
      {
      type:'',
    
    flat:{
      number:'',
    }
  }]
  });

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);
  const [loading, setLoading] = useState(true);


  const getSingleFlatResidents = async () => {
    if (initialData) {
      try {
        setLoading(true);
        //  await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${initialData.flats[0].flat.floor.building.id}/floors/${initialData.flats[0].flat.floor.id}/flats/${initialData.flats[0].flat.id}/residents/${residentId}`, {
          withCredentials: true,
        });
  
        const { content } = response.data;
        console.log(content);
        console.log(residentId);
        console.log(response);
        const ViewResidents = response.data;
        console.log(ViewResidents);
        setViewResidents(ViewResidents);
        setLoading(false);
      } catch (error) {
        console.log(error);
        console.log("Something went wrong");
        setLoading(false);
      }
    } else {
      console.log('initialData is null');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getSingleFlatResidents();
  }, [residentId, user, societycontext]);

  console.log(viewResidents)


  function insertSpacesBetweenWords(text:string) {
    const words = text.split('_');
    const formattedWords = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
  }
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Resident Details <CloseIcon onClick={onClose}  sx={{position: 'absolute', top: '10px', right: '10px', cursor: 'pointer'}} /></h2>
        <div className={styles['resident-card']}>
          <div className={styles['resident-details']}>
          {loading ? (
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
       <p className={styles['resident-name']}></p>
            <p className={styles['resident-email']}></p>
            <p style={{paddingTop:"75px", paddingBottom:"76px"}}><CircularProgress /></p>
            <p className={styles['resident-phone']}></p>
            {/* <p className={styles['resident-phone']}>Resident Type: {viewResidents.flats[0].type.charAt(0).toUpperCase() + viewResidents.flats[0].type.slice(1).toLowerCase()}</p> */}
            <p className={styles['resident-phone']}></p>
      </div>
      ):(
        <>
            <p className={styles['resident-name']}>Name: {viewResidents.name}</p>
            <p className={styles['resident-email']}>Email ID: {viewResidents.email}</p>
            <p className={styles['resident-phone']}>Phone Number: +91-{viewResidents.phoneNumber}</p>
            <p className={styles['resident-phone']}>Flat Number: {viewResidents.flats[0].flat.number}</p>
            {/* <p className={styles['resident-phone']}>Resident Type: {viewResidents.flats[0].type.charAt(0).toUpperCase() + viewResidents.flats[0].type.slice(1).toLowerCase()}</p> */}
            <p className={styles['resident-phone']}>Resident Type: {insertSpacesBetweenWords(viewResidents.flats[0].type)}</p>
            
            </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default ViewResidentComponent;
