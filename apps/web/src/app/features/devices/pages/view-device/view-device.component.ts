import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AddDevice,  } from '@fnt-flsy/data-transfer-types';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { Site } from '@fnt-flsy/data-transfer-types';
import { ViewDevice, } from '@fnt-flsy/data-transfer-types';
import { Device } from '@fnt-flsy/data-transfer-types';



@Component({
  selector: 'fnt-flsy-view-device',
  templateUrl: './view-device.component.html',
  styleUrls: ['./view-device.component.scss'],
})
export class ViewDeviceComponent implements OnInit {

  id!: number;
  AddDevices: AddDevice | null=null;

  private subscription!: Subscription;
  devices: MatTableDataSource<Device> = new MatTableDataSource<Device>([]);
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  devicesPageSize = 10;
  devicesPageOffset = 0;
  device!: AddDevice;
  viewDevices: ViewDevice| null = null;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private deviceService: DevicesService,
    
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.fetchDeviceDetails(this.id);
    console.log(this.id);
  }

  // fetchDevices(id: number): void {
  //   console.log('function called', id);
  //   this.deviceService
  //     .getFilteredDevices(
  //       this.devicesPageSize,
  //       this.devicesPageOffset,
  //       '',
  //       id,
  //       'name',
  //       'asc'
  //     )
  //     .subscribe({
  //       next: (devices: any) => {
  //         console.log('Fetched sites:', devices);
  //         this.device = devices.content;
  //         this.totalItems = devices.total;
  //       },
  //       error: (error: any) => {
  //         console.error('Failed to fetch sites:', error);
  //       },
  //     });
  // }


  fetchDeviceDetails(id: number): void {
    this.deviceService.getDeviceById(this.id).subscribe({
      next: (device: ViewDevice) => {
        console.log('Fetched device:', device);
        this.viewDevices = device;
      },
      error: (error: any) => {
        console.error('Failed to fetch device:', error);
      }
    });
  }
  goToListPage() {
    this.router.navigate([`/sites/${this.viewDevices?.site.id}`]);
  }
}
