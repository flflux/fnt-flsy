import React,{useContext, useEffect, useRef, useState} from "react";
import styles from './app-bar.module.scss';
import { AppBar, Box, Button, IconButton, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserContext } from "../../contexts/user-context";
import { User } from "@fnt-flsy/data-transfer-types";
import { Link, useNavigate } from 'react-router-dom';
// import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import fountlab from "../../../assets/fount-lab-logo.png";
import UserImg from "../../../assets/User.png";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsIcon from '@mui/icons-material/Settings';
// import PersonIcon from '@mui/icons-material/Person';
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
    console.log("menu clicked")
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

  // useEffect(() => {
  //   // Attach the event listener
  //   window.addEventListener('resize', handleResize);

  //   // Detach the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);
  

  return (
    
    <AppBar className={styles['appbar']}>
          <div>
          {/* <Link to="/logout"><Button className={styles['person_icon']} color="primary">LogOut</Button></Link> */}
          
          {/* <img src={fountlab} alt="font lab logo" width="150px" height="23px" className={styles['logo']} /> */}
          <img src={hivelogo} alt="font lab logo" width="150px" height="50px"  className={styles['logo']} />

          <Box >
            <div className={styles["userbox"]} >
              <div className={styles["usertext"]}>
                <h4>{user?.firstName}  {user?.lastName}</h4>

                {/* <h6>{user?.superRole}</h6> */}
                <h6 className={styles["user-role"]}>{user?.societyRoles[0]?.societyRole}</h6>
               
              </div>
              {/* <div className={styles["userimg"]} onClick={handleResize}> */}
              <div className={styles["userimg"]}  onClick={handleMenu}>
                <AccountCircle   className={styles['accountcircle']}/>
              </div>
              {/* <IconButton onClick={handleMenu} className={styles['Icon_box']}>
                {!openProfile ? <KeyboardArrowDownIcon className={styles['dropdown_icon']} /> : <KeyboardArrowUpIcon className={styles['dropdown_icon']} />}
              </IconButton> */}
            </div>
            
          </Box>
              <Menu
              className={styles['menu-items']}
                // id="menu-appbar"
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

                // sx={{
                //   '@media (max-width: 600px)':{
                //      '& .MuiMenu-paper':{
                //       width:'170px',
                //       marginLeft:'0px',
                //       borderRadius:'0px 0px 0px 0px',
                //      }
                //   }
                // }}

                
             
                >
                {/* <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><SettingsIcon sx={{marginRight:'10px'}}/>Settings</MenuItem> */}
                <Link to="/profile" style={{textDecoration:'none', color:'black'}}>
                <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><PersonIcon sx={{marginRight:'10px'}}/>Profile</MenuItem>
                </Link>
                <Link to="/logout" style={{textDecoration:'none', color:'black'}}>
                <MenuItem className={styles['menu-options']} sx={{color:'black'}} onClick={handleClose}><PowerSettingsNewIcon sx={{marginRight:'10px'}}/> Logout</MenuItem>
                </Link>
                
              </Menu>
              
          </div>
    </AppBar>
  );
  
}

export default TopBar;
