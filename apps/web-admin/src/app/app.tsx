// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import axios from 'axios';
import { UserContext } from '../app/contexts/user-contexts';
import { User as DtUser } from '@fnt-flsy/data-transfer-types'
import { User } from '@fnt-flsy/data-transfer-types'
import { useState, useEffect, Component } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import ListSocieties from './pages/list-societies/list-societies';
import LogOut from '../app/Components/logout/logout';
import Login from '../app/Components/login/login';
import Layout from './Components/layout/layout';
import ProtectedRoute from './Routes/protected-route/protected-route';


import ListVehicle, { VehiclesList } from './pages/list-vehicle/list-vehicle';
import View from './pages/view/view';
import ListController from './pages/list-controller/list-controller';
import AddSocietyPage from './pages/list-societies/add-society-page/add-society-page';
import EditSocietyPage from './pages/list-societies/edit-society-page/edit-society-page';
import ViewSocietyPage from './pages/list-societies/view-society-page/view-society-page';
import ListFlats from './pages/list-flats/list-flats';
import ListBuildings from './pages/list-buildings/list-buildings';
import ViewFlats from './pages/view-flat/view-flat';
import ViewVehicles from './pages/view-vehicles/view-vehicles';
import ViewDevices from './pages/view-devices/view-devices';
import ListFloor from './pages/view-building/list-floor';
import ListResidents from './pages/list-resident/list-resident';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import SocietyLayout from './Routes/society-layout/society-layout';
import ListAllController from './pages/list-all-controller/list-all-controller';
import ListAllVehicle from './pages/list-all-vehicle/list-all-vehicle';
import DeviceImage from './Components/device-image/device-image';
import ListFLUser from './pages/list-FL-user/list-fl-user';
import PageNotFound from './Components/page-not-found/page-not-found';
import Profile from './Components/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import UpdatePassword from './pages/update-password/update-password';
import ForgetPassword from './pages/forget-password/forget-password';



export function App() {

  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const params = useParams()

  // const shouldRenderLayout = location.pathname !== '*';
  const validRoutes = ['/login'];

  const shouldRenderLayout = validRoutes.includes(location.pathname);

  const navigate = useNavigate();

  const onLogout = async () => {
    localStorage.removeItem('user');
    console.log("logout", user);
    setUser(null);
    navigate("/login");
  }

  const onLogin = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    // setUser(user);

    // console.log("onLogin", user);
    // navigate("/societies");
    if (!user?.superRole) {
      enqueueSnackbar("User does not have a Super Role. Can't log in.", { variant: 'warning' });
      navigate("/login");
    } else {
      setUser(user);
      enqueueSnackbar("Login successfully!", { variant: 'success' });
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');  
    if (userFromStorage !== null) {
      const user: User = JSON.parse(userFromStorage);     
      setUser(user);                                       
    }
    
  }, []);

  return (
    <>
      {/* {!shouldRenderLayout && <Layout />} */}
      <UserContext.Provider value={user}>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/" element={<Layout/>}>
            {/* <Route path="/societies/:id" element={<View/>}/> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/societies" element={<ListSocieties/>}/>
            <Route path="/societies/add" element={<AddSocietyPage/>}/>
            <Route  element={<SocietyLayout/>}>
      
              <Route path="/societies/:societyId/edit" element={<EditSocietyPage/>}/> 
              <Route path="/societies/:societyId" element={<View/>}/>
              <Route path="/societies/:societyId/details" element={<ViewSocietyPage/>}/>
              <Route path="/societies/:societyId/flats" element={< ListFlats/>} />
              <Route path="/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id" element={< ViewFlats />} />
              <Route path="/societies/:societyId/buildinglist" element={<ListBuildings />} />
              <Route path="/societies/:societyId/buildinglist/:id" element={< ListFloor />}/>
              <Route path="/societies/:societyId/residentlist" element={<ListResidents />}/>
              <Route path="/societies/:societyId/vehiclelist" element={<VehiclesList />} />
              <Route path="/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles/:id" element={< ViewVehicles />}/>
              <Route path="/societies/:societyId/devicelist" element={<ListController />} />
              <Route path="/societies/:societyId/devices/:id" element={< ViewDevices />}/> 
         
              <Route path="/profile" element={<Profile />}/>
            </Route>
            <Route path="/vehicles"  element={<ListAllVehicle/>}/>
            <Route path="/users"  element={<ListFLUser />}/>
            {/* <Route path="/society" element={<ViewSocietyPage/>}/> */}
            {/* <Route path="/device/:id"  element={<DeviceView/>}/>
            <Route path="/device/:id/vehicles"  element={<DeviceLinking/>}/> */}
          </Route>
          {/* <Route path="/device-image" element={<DeviceImage/>}/> */}
         
          <Route path="/forgot-password" element={<ForgetPassword/>}/>
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword/>} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
        </SnackbarProvider>
      </UserContext.Provider>
    </>
    );
}

export default App;
