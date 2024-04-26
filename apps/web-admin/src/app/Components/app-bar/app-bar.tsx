import React,{useContext, useRef, useState} from "react";
import styles from './app-bar.module.scss';
import { AppBar, Box, Button, IconButton, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserContext } from "../../contexts/user-contexts";
import { User } from "@fnt-flsy/data-transfer-types";
import { Link, useNavigate } from 'react-router-dom';
// import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import fountlab from "../../../assets/fount-lab-logo.png";
import UserImg from "../../../assets/User.png";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import axios from "axios";
import hivelogo from "../../../assets/HIVE_Logo_Black.svg"



/* eslint-disable-next-line */
export interface AppBarProps { 
  // onLogout:(user:User)=>void;
  
}

export function TopBar() {
  const userContext=useContext(UserContext);
  const [openProfile,setOpenProfile]=useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileView = window.innerWidth <= 768;
  
  const navigate = useNavigate();

  const user=useContext(UserContext);
  const menuPaperRef = useRef(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenProfile((prev)=>!prev)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenProfile((prev)=>!prev);
  };

  const handleResize = (event: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth <= 768) {
      handleMenu(event);
    }
  };


  return (
    
    <AppBar className={styles['appbar']}>
          <div>
          {/* <Link to="/logout"><Button className={styles['person_icon']} color="primary">LogOut</Button></Link> */}
          {/* <img src={fountlab} alt="font lab logo" width="150px" height="23px" className={styles['logo']} /> */}
          <img src={hivelogo} alt="font lab logo" width="100px" height="45px" className={styles['logo']} />

          <Box>
            <div className={styles["userbox"]} >
              <div className={styles["usertext"]}>
                <h4>{user?.firstName}  {user?.lastName}</h4>
                <h6>{user?.superRole}</h6>
              </div>
              {/* <div className={styles["userimg"]} onClick={handleResize}> */}
              <div className={styles["userimg"]} onClick={handleMenu}>
                <AccountCircle     className={styles['accountcircle']}  />
                {/* <img src={PersonIcon} alt="User img" height="44px" width="44px" onClick={handleResize}/> */}
              </div>
              {/* <IconButton onClick={handleMenu} className={styles['dropdown_icon']}>
                {!openProfile ? <KeyboardArrowDownIcon  /> : <KeyboardArrowUpIcon  />}
              </IconButton> */}
            </div>
            
          </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
                
                keepMounted
                transformOrigin={{
                  vertical:'bottom',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                
                PaperProps={{
                  style: {
                    width: '248px', // Set the width to 248 pixels
                    marginTop: '40px', // Set the top position to 56 pixels
                    marginLeft:'-4px',
                    border: '1px solid #4D4D4D',
                    boxShadow:'none',
                    borderRadius:' 0px 0px 4px 4px',
                    position: 'absolute',
                    zIndex: -1, 
                    // transition: 'margin-top 0.3s',
                    animation:'dropdown 0.5s ease',
                    ...(isMobileView ? {
                      width: '170px !important',
                      maxWidth: 'fit-content',
                      marginLeft: '-38 !important',
                      borderRadius:' 0px 0px 0px 0px !important',
                    } :''),
                  },
                }}
             
                >
                {/* <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><SettingsIcon sx={{marginRight:'10px'}}/>Profile</MenuItem> */}
                <Link to="/profile" style={{textDecoration:'none', color:'black'}}>
                <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><PersonIcon sx={{marginRight:'10px'}}/>Profile</MenuItem>
                </Link>
                <Link to="/logout" style={{textDecoration:'none', color:'black'}}>
                <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><PowerSettingsNewIcon sx={{marginRight:'10px'}}/> Logout</MenuItem></Link>
                
              </Menu>
              
          </div>
    </AppBar>
  );
  
}

export default TopBar;
