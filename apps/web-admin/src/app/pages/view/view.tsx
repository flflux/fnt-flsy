import styles from './view.module.scss';
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import React from 'react';
import FlatList from "../list-flats/list-flats";
import ResidentList from "../list-resident/list-resident";
import VehiclesList from '../list-vehicle/list-vehicle';
import ControllerList from "../list-controller/list-controller";
import SocietyView from '../list-societies/view-society-page/view-society-page';
import ListBuildings from '../list-buildings/list-buildings';

/* eslint-disable-next-line */
export interface ViewProps {
}

export function View(props: ViewProps) {
  const [value, setValue] = React.useState('1');
  const [toggle, setToggle]=useState(1);
  const navigate=useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles['viewcontainer']}>
      <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={styles['tabnav']}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1"/>
            <Tab label="Buildings" value="6"/>
            <Tab label="Flats" value="5" />
            <Tab label="Residents" value="2" />
            <Tab label="Vehicles" value="3" />
            <Tab label="Controllers" value="4" />   
          </TabList>
        </Box>
        <TabPanel value="1"><SocietyView/></TabPanel>
        <TabPanel value="5"><FlatList/></TabPanel>
        <TabPanel value="6"><ListBuildings/></TabPanel>
        <TabPanel value="2"><ResidentList /></TabPanel>
        <TabPanel value="3"><VehiclesList/></TabPanel>
        <TabPanel value="4"><ControllerList/></TabPanel>
      </TabContext>
    </div>
  );
}

export default View;
