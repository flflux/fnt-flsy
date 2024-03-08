import { Box, Card, CardContent, Tab } from '@mui/material';
import styles from './profile.module.scss';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Device } from '@fnt-flsy/data-transfer-types';
import EditProfile from '../edit-profile/edit-profile';
import Security from '../security/security';
import EditIcon from '@mui/icons-material/Edit';

/* eslint-disable-next-line */
export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const [profileValue, setProfileValue] = React.useState('1');
  const [securityValue, setSecurityValue] = React.useState('1');
  const [edit, setEdit] = useState(false);
  const [userEdit, setUserEdit] = useState(true); 
  const params = useParams();
  
  const handleProfileChange = (event: React.SyntheticEvent, newValue: string) => {
    setProfileValue(newValue);
  };
  const handleSecurityChange = (event: React.SyntheticEvent, newValue: string) => {
    setSecurityValue(newValue);
  };

  const handleEditDetails = () => {
    console.log("Refreshed clicked");
    setEdit(true);
  };

  const handleUserEditChange = (newValue:boolean) => {
    setEdit(newValue);
  };
  return (
    <Box className={styles['main_container']}>
      <Card sx={{ minWidth: 275, margin: 2 }} className={`${styles['Details-card']} ${edit ? styles['edit-mode'] : ''}`}>
      <CardContent>
        <TabContext value={profileValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TabList onChange={handleProfileChange} aria-label="lab API tabs example">
              <Tab className={styles['Tab']} label="Profile" value="1" />
              <Tab className={styles['Tab']} onClick={() => setEdit(false)} label="Security" value="2" />
            </TabList>
            <Box style={{ margin: '9px' }}>
            {profileValue === '2' ? (
                <>
                </>
              ) : (
              <EditIcon onClick={handleEditDetails} style={{ cursor: 'pointer' }} />
              )}

            </Box>
          </Box>
          {/* <Button
      className={styles['add_btn']}
      onClick={() => {
        // Handle the click event for "Add New Flat" button
      }}
    >
      Add
</Button> */}
          <Box>
            <TabPanel value="1"><EditProfile editUser={edit} userEdit={handleUserEditChange} /></TabPanel>
            <TabPanel className={styles['Password-card']}  value="2"><Security /></TabPanel>
          </Box>
        </TabContext>
      </CardContent>
    </Card>
      </Box>
  );
}

export default Profile;
