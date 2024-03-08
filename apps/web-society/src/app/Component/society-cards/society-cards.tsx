import React,{useState,useEffect, useContext} from 'react';
import styles from './society-cards.module.scss';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { ListSocietyPage, Society, ViewSociety } from '@fnt-flsy/data-transfer-types';
import { UserContext } from '../../contexts/user-context';
import { Link } from 'react-router-dom';


/* eslint-disable-next-line */
export interface SocietyCardsProps {}

export function SocietyCards(props: SocietyCardsProps) {
  const [apt, setApt]=useState([]);
  const userContext = useContext(UserContext);

  useEffect(()=>{
    getApt();
  },[]);


  const getApt=async()=>{
    await axios.get("http://localhost:3000/societies/1/buildings-info",{
        withCredentials:true,
      },
    ).then(function(response){
      console.log("home society", response)
        setApt(response.data.content.buildings); ;
        console.log("society:",response.data);
    });
      
  }
 
  return (
    <div className={styles['container']} >
      <h1>Building Cards:</h1>
      <h1>{userContext?.firstName}</h1>
      <div className={styles['card-grid']} >
      {apt && apt.map((item: ViewSociety,key)=>{
          return(
            <Link to="/buildinglist" style={{textDecoration:"none"}} key={key}>
            <Card className={styles['card']} sx={{ maxWidth: 345 }} >
              <CardMedia
                sx={{ height: 140 }}
                image="https://img.freepik.com/free-photo/mumbai-skyline-skyscrapers-construction_469504-21.jpg?w=900&t=st=1693821699~exp=1693822299~hmac=af7059a8c49a37f1fcf9a069a7a9507bb0d1d859ad894c3677e08a4f1f1debae"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                   {item.name}
                </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Flats: {item.assetcount?.flatLength || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Residents: {item.assetcount?.residentLength || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Vehicles: {item.assetcount?.vehicleLength || 0}
                    </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">{item.city}</Button>
                {/* <Button size="small">{item.countryCode}</Button> */}
              </CardActions>
            </Card>
            </Link>
          );
        })
      }
      </div>
    </div>
  );
}


export default SocietyCards;
