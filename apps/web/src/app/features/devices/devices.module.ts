import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesComponent } from './devices.component';
import { ListDevicesComponent } from './pages/list-devices/list-devices.component';
import { AddDeviceComponent } from './pages/add-device/add-device.component';
import { ViewDeviceComponent } from './pages/view-device/view-device.component';
import { EditDeviceComponent } from './pages/edit-device/edit-device.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    DevicesComponent,
    ListDevicesComponent,
    AddDeviceComponent,
    ViewDeviceComponent,
    EditDeviceComponent,
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatAutocompleteModule

  ],
})
export class DevicesModule {}
