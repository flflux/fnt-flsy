import { useContext, useEffect, useState } from 'react';
import styles from './select-society.module.scss';
import { UserContext } from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';

/* eslint-disable-next-line */
export interface SelectSocietyProps {}

export function SelectSociety(props: SelectSocietyProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState([0]);
  const user=useContext(UserContext);
  const navigate=useNavigate();

  useEffect(()=>{
    if(user?.societyRoles.length > 1){
      return;
    }else{
      navigate(`/dashboard/${user?.societyRoles[0].societyId}`);
    }
  },[user?.societyRoles.length, navigate]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log("value:",value)

    // Navigate to society dashboard when the checkbox is checked
    if (currentIndex === -1) {
      navigate(`/dashboard/${value}`); // Adjust the route as needed
    }
  };

  const handleRadioChange = (value: number) => () => {
    setSelected(value);
    navigate(`/dashboard/${value}`);
  };

  console.log("user context:",user);
  console.log("user context scoietty:",user?.societyRoles);
  console.log("user context scoietty length:",user?.societyRoles.length);


  return (
    
      <div className={styles['login-page']}>
        {/* <h1>Welcome to SelectSociety!</h1> */}
        <div className={styles['form-container']}>
          <Box className={styles['society-header']}>
             <h1 >Select Society</h1>
          </Box>
          <div className={styles['society-list']}>
            <List sx={{ bgcolor: 'background.paper' }}>
                {user?.societyRoles.map((value) => {
                    const labelId = `checkbox-list-label-${value.societyId}`;

                    return (
                      <ListItem key={value.societyId} disablePadding className={styles['society-list-item']}>
                        <ListItemButton role={undefined} onClick={handleRadioChange(value.societyId)} dense>
                          <ListItemIcon>
                          <Radio
                            checked={selected === value.societyId}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={` ${value.societyName}`} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
            </List>
            </div>
        </div>
      </div>
  
  );

}

export default SelectSociety;
