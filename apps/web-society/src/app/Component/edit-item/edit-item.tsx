import { useState } from 'react';
import styles from './edit-item.module.scss';
import axios from 'axios';
import { environment } from '../../../environments/environment';

/* eslint-disable-next-line */
export interface EditItemProps {}

export function EditItem(props: EditItemProps) {

  const [newName, setNewName] = useState<string>("");
  const [socId, setSocId] = useState<number>();
  const [actives, setActives] = useState<boolean>();

  const update=async ()=>{
    const apiUrl = environment.apiUrl;
    // e.preventDefault();
    // console.log('Update button clicked');
    // try {
    //   const updatedData = {
    //     name: newName,
    //     societyId: socId,
    //     isActive: actives,
    //   };
      // const response = await axios.put(
      //   `${apiUrl}/societies/1/buildings/${selectedVehicleId}`,
      //   updatedData,
      //   {
      //     withCredentials: true,
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   },

      // );

  //     console.log(response.data);

  //     if (response.data) {
  //       console.log('Building Name Updated Successfully');
  //       navigate('/buildinglist');
  //       getAllBuildings();
  //       setIsModalOpen(false)
  //     } else {
  //       console.log('Update data not received');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     console.log('Something went wrong');
  //   }
  }

  
}

export default EditItem;
