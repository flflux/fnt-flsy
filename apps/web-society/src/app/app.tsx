// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import ListBuildings from './pages/list-buildings/list-buildings';
import Login from './Component/login/login';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/home/home';
import Layout from './Component/layout/layout';
import ListFlats from './pages/list-flats/list-flats';
import { UserContext } from './contexts/user-context';
import { User as DtUser } from '@fnt-flsy/data-transfer-types'
import {User} from '@fnt-flsy/data-transfer-types'
import { useState, useEffect, Component, useContext } from 'react';
import LogOut from './Component/log-out/log-out';
import ProtectedRoute from './Routes/protected-route/protected-route';
import VehiclesList from './pages/list-vehicle/list-vehicle';
import ListController from './pages/list-controller/list-controller';
import Dashboard from './pages/dashboard/dashboard';
import ViewFlats from './pages/view-flat/view-flat';
import ViewVehicles from './pages/view-vehicles/view-vehicles';
import ViewDevices from './pages/view-devices/view-devices';
import Vehicles from './pages/view-devices/vehicles/vehicles';
import ListFloor from './pages/view-building/list-floor';
import ListResidents from './pages/list-resident/list-resident';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import Reports from './pages/reports/reports';
import SelectSociety from './pages/select-society/select-society';
import SocietyLayout from './Routes/society-layout/society-layout';
import PageNotFound from './Component/page-not-found/page-not-found';
import Profile from './Component/profile/profile';
import ForgotPassword from './pages/forgot-password/forgot-password';
import UpdatePassword from './pages/update-password/update-password';



export function App() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const usercontext=useContext(UserContext);
  // console.log('User context:',usercontext);

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
    // // navigate("/dashboard");
    // navigate("/selectSociety");
    if (user.societyRoles.length === 0) {
      enqueueSnackbar("User does not have a society manager role.", { variant: 'warning' });
      navigate("/login");
    } else {
      setUser(user);
      navigate("/selectSociety");
      enqueueSnackbar("Login successfully!", { variant: 'success' });
    }
  }

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');   //get user form storage
    if (userFromStorage !== null) {
      const user: User = JSON.parse(userFromStorage);       //store the user of type User
      setUser(user);                                       //updtae the state of the user with storeduser
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      <SnackbarProvider maxSnack={3}>
        <Routes>
        <Route  element={<SocietyLayout/>}>
          <Route path="/" element={<Layout />}>
              <Route path="/dashboard/:societyId" element={<Dashboard />} />
              <Route path="/society/:societyId/flats" element={< ListFlats />} />
              <Route path="/society/:societyId/residents" element={<ListResidents />} />
              <Route path="/society/:societyId/buildings" element={<ListBuildings />} />
              <Route path="/society/:societyId/vehicles" element={<VehiclesList />} />
              <Route path="/society/:societyId/devices" element={<ListController />} />
            <Route path="/societies/:societyId/buildings/:buildingId/floors/:floorId/flats/:id" element={< ViewFlats />} />
            <Route path="/societies/:societyId/buildings/:buildingId/floors/:floorId/flat/:flatId/vehicles/:id" element={< ViewVehicles />} />
            <Route path="/societies/:societyId/devices/:id" element={< ViewDevices />} />
            <Route path="/society/:societyId/buildings/:id" element={< ListFloor />} />
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/profile" element={<Profile />}/>
            
          </Route>
          </Route>
           <Route path="/selectSociety" element={<SelectSociety />} />
           
           <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/update-password/email/:emailId/token/:token" element={<UpdatePassword/>} />
          <Route path="/logout" element={<LogOut onLogout={onLogout} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          {/* <Route path="/societies/:SocietyId/device/:deviceId/vehicles" element={<Vehicles id={}/>}/> */}
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<PageNotFound/>}/>


        </Routes>
      </SnackbarProvider>
    </UserContext.Provider>
  );

}

export default App;
