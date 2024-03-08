import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DevicesService } from '../../services/devices.service';
import { Router } from '@angular/router';
import { Device } from '@fnt-flsy/data-transfer-types';

@Component({
  selector: 'fnt-flsy-list-devices',
  templateUrl: './list-devices.component.html',
  styleUrls: ['./list-devices.component.scss'],
})
export class ListDevicesComponent implements OnInit {
  devicecolumns: string[] = ['name', 'edit']; // Define your columns here
  dataSource: MatTableDataSource<Device> = new MatTableDataSource<Device>([]); // Initialize the dataSource as MatTableDataSource

  constructor(private router: Router, private devicesService: DevicesService) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.devicesService.getAllDevice().subscribe({
      next: (devices: any) => {
        this.dataSource.data = devices.content; // Assign the fetched data to the dataSource
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
      },
    });
  }

  goToAddDevice() {
    this.router.navigate(['/devices', 'add']);
  }

  editDevice(deviceId: number) {
    this.router.navigate(['/devices', 'edit', deviceId]);
  }

  deleteDevice(deviceId: number) {
    this.devicesService.deleteDevice(deviceId).subscribe(
      () => {
        this.loadDevices();
      },
      (error) => {
        console.error('Error deleting devices:', error);
      }
    );
  }
}
