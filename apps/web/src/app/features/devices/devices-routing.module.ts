import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevicesComponent } from './devices.component';
import { ListDevicesComponent } from './pages/list-devices/list-devices.component';
import { AddDeviceComponent } from './pages/add-device/add-device.component';
import { ViewDeviceComponent } from './pages/view-device/view-device.component';
import { EditDeviceComponent } from './pages/edit-device/edit-device.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DevicesComponent,
    children: [
      {
        path: '',
        component: ListDevicesComponent,
      },

      {
        path: 'add',
        component: AddDeviceComponent,
      },

      {
        path: ':id',
        children: [
          {
            path: '',
            component: ViewDeviceComponent,
          },
          {
            path: 'edit', 
            component: EditDeviceComponent,
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
