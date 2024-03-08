import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SitesService } from '../../../sites/services/sites.service';
import { SitegroupsService } from '../../../sitegroups/services/sitegroups.service';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AddDevice} from '@fnt-flsy/data-transfer-types';
import { DevicesService } from '../../services/devices.service';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { SiteGroup } from '@fnt-flsy/data-transfer-types';
import { Site } from '@fnt-flsy/data-transfer-types';
import { DeviceType } from '@prisma/client';

@Component({
  selector: 'fnt-flsy-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit{
  addDeviceForm!: FormGroup;
  organizationId: number | 0=0;
  organizations: Organization[] = [];
  selectedOrganizationId: number | null = null;
  sitegroups: SiteGroup[]=[];
  selectedSiteGroupId: number | null = null;
  sites: Site[]=[];
  selectedSiteId: number | null = null;
  devices: MatTableDataSource<AddDevice>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private organizationsService: OrganizationsService,
    private siteGroupService: SitegroupsService,
    private sitesService: SitesService,
    private deviceService: DevicesService
  ) {
    this.devices=new MatTableDataSource<AddDevice>([])
  };

  
  ngOnInit(): void {
    this.addDeviceForm = this.fb.group({
      organizationId: [null, Validators.required],
      siteGroupId: [null, Validators.required],
      siteId:[null, Validators.required],
      name: ['', Validators.required],
      deviceId:['',Validators.required]
    });
    this.fetchOrganizations();
    this.addDeviceForm.get('organizationId')?.valueChanges.subscribe((organizationId) => {
      this.fetchSiteGroups(organizationId);
    });
    this.addDeviceForm.get('siteGroupId')?.valueChanges.subscribe((siteGroupId) => {
      this.fetchSites(siteGroupId);
    });
    
    console.log(' DATA CHECK ',this.addDeviceForm)
  };

  
  fetchOrganizations(): any {
    this.organizationsService
      .getFilteredOrganizations(Number.MAX_SAFE_INTEGER, 0)
      .subscribe({
        next: (organizations: any) => {
          this.organizations = organizations.content;
          console.log(organizations.content);
        },
        error: (error) => {
          console.error('Failed to fetch organizations:', error);
        },
      });
      //this.fetchSiteGroups(this.organizations.content);
  };

  fetchSiteGroups(organizationId:number): any {
    this.siteGroupService
      .getFilteredSiteGroups(Number.MAX_SAFE_INTEGER, 0,undefined,organizationId)
      .subscribe({
        next: (sitegroup: any) => {
          this.sitegroups = sitegroup.content;
          console.log(sitegroup.content);
        },
        error: (error: any) => {
          console.error('Failed to fetch sitegroups:', error);
        },
      });
  };

  // fetch sites logic here
  
  fetchSites(siteGroupId:number): any {
    this.sitesService
      .getFilteredSites(Number.MAX_SAFE_INTEGER, 0,undefined,siteGroupId)
      .subscribe({
        next: (site: any) => {
          this.sites = site.content;
          console.log(site.content);
        },
        error: (error: any) => {
          console.error('Failed to fetch sites:', error);
        },
      });
  };


  submitForm(data: {
    siteId: number; name: string; deviceId: string 
}): void {
    if (this.addDeviceForm.valid) {
      const deviceData = {
        siteId: data.siteId,
        deviceId: data.deviceId,
        name: data.name,
        thingId:'',
        thingKey:'',
        channelId:'',
        type: DeviceType.CONTROL
      };

      this.deviceService.addDevice(deviceData).subscribe({
        next: (device: any) => {
          console.log('Device added successfully:', device);
          this.router.navigate(['/devices', device.id]);
        },
        error: (error: any) => {
          console.error('Failed to add device:', error);
        },
      });
    }
  };

onQueryChange() {
  this.fetchOrganizations();
}
}
