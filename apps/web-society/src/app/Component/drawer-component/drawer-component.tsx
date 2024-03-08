import styles from './drawer-component.module.scss';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import GroupsIcon from '@mui/icons-material/Groups';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import Home from '../../pages/home/home';
import ListBuildings from '../../pages/list-buildings/list-buildings';
import { Link, useParams } from 'react-router-dom';
import ListController from '../../pages/list-controller/list-controller';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import barrier from '../../../assets/parking_1057371.png';
import fountlab from "../../../assets/fount-lab-logo.png"
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { SocietyContext } from '../../contexts/user-context';

/* eslint-disable-next-line */
export interface DrawerComponentProps { };

const drawerWidth = 200;

export function DrawerComponent(props: DrawerComponentProps) {
  // const [menudata, setMenudata] = useState("home")
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentChange = (componentName:any) => {
    setSelectedComponent(componentName);
  };
  const { id } = useParams();

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  return (
    <div>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: '200px', 
            boxSizing: 'border-box',
            marginTop: '64px',
            backgroundColor: '#2B3445',
          },
          '@media (max-width: 600px)': {
            '& .MuiDrawer-paper': {
              width: '48px',
            },
          },
        }}
        variant="permanent"
        anchor="left"
        className={styles['side-drawer']}
      >

        {/* <Toolbar sx={{height:"59px"}}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></Toolbar> */}
        {/* <Divider /> */}
        <List className={styles['Nav']}>
          {/* <ListItem disablePadding> */}
          <Link style={{ textDecoration: "none" }} to={`/dashboard/${societycontext?.id}`} onClick={() => handleComponentChange('dashboard')}>
            <ListItemButton className={`${styles['button-tabs']} ${
                selectedComponent === 'dashboard' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <DashboardIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to={`/society/${societycontext?.id}/buildings`} onClick={() => handleComponentChange('buildings')}>
            <ListItemButton  className={`${styles['button-tabs']} ${
                selectedComponent === 'buildings' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <ApartmentIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Buildings" />
            </ListItemButton>
          </Link>
          {/* </ListItem> */}

          <Link style={{ textDecoration: "none" }} to={`/society/${societycontext?.id}/flats`} onClick={() => handleComponentChange('flats')}>
            <ListItemButton  className={`${styles['button-tabs']} ${
                selectedComponent === 'flats' && styles['active-tab']
              }`}>
              <ListItemIcon>
                <MapsHomeWorkIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Flats" />
            </ListItemButton>
          </Link>

          {/* <Link style={{ textDecoration: "none" }} to="/residents">
            <ListItemButton>
              <ListItemIcon>
                <GroupsIcon  className={styles['drawer-icons']}/>
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Residents" />
            </ListItemButton>
          </Link>

          <Link style={{ textDecoration: "none" }} to="/vehicles">
            <ListItemButton>
              <ListItemIcon>
                <DirectionsCarIcon  className={styles['drawer-icons']}/>
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Vehicles" />
            </ListItemButton>
          </Link> */}

          <Link style={{ textDecoration: "none" }} to={`/society/${societycontext?.id}/devices`} onClick={() => handleComponentChange('devices')}>
            <ListItemButton className={`${styles['button-tabs']} ${
                selectedComponent === 'devices' && styles['active-tab']
              }`}>
              <ListItemIcon >
                <DeviceHubIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Devices" />
            </ListItemButton>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/reports" onClick={() => handleComponentChange('reports')}>
            <ListItemButton  className={`${styles['button-tabs']} ${
                selectedComponent === 'reports' && styles['active-tab']
              }`}>
              <ListItemIcon >
                <LibraryBooksIcon className={styles['drawer-icons']} />
              </ListItemIcon>
              <ListItemText className={styles["drawertab"]} primary="Reports" />
            </ListItemButton>
          </Link>

        </List>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;





