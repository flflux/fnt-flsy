import styles from './view-fl-admin.module.scss';
import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { SocietyContext } from '../../../contexts/user-contexts';


export interface ViewFLUserComponentProps {
  open: boolean;
  onClose: () => void;
  initialData: FLUser | null;
  // initialData: ViewResident | null;
}

interface FLUser {
  id:number;
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isActive:boolean;
  }


const ViewFLUserComponent: React.FC<ViewFLUserComponentProps> = ({ open, onClose, initialData }) => {

  function insertSpacesBetweenWords(text:string) {
    const words = text.split('_');
    const formattedWords = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
  }

  if (!initialData) {
    return null; 
  }
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>User Details <CloseIcon onClick={onClose}  sx={{position: 'absolute', top: '10px', right: '10px', cursor: 'pointer'}} /></h2>
        <div className={styles['resident-card']}>
          <div className={styles['resident-details']}>
            <p className={styles['resident-name']}>Name: {initialData?.firstName} {initialData?.lastName}</p>
            <p className={styles['resident-phone']}>Email ID: {initialData?.email}</p>
            <p className={styles['resident-phone']}>Phone Number: +91-{initialData?.phoneNumber}</p>
            <p className={styles['resident-phone']}>Role: {insertSpacesBetweenWords(initialData?.superRole)}</p>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default ViewFLUserComponent;
