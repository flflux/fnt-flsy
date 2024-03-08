import { Component, OnInit } from '@angular/core';
import { ViewDevice, Device, ViewSiteGroup } from '@fnt-flsy/data-transfer-types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SitesService } from '../../../sites/services/sites.service';
import { SitegroupsService } from '../../../sitegroups/services/sitegroups.service';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { Organization, ViewSite } from '@fnt-flsy/data-transfer-types';
import { SiteGroup } from '@fnt-flsy/data-transfer-types';
import { Site } from '@fnt-flsy/data-transfer-types';

@Component({
  selector: 'fnt-flsy-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {
  deviceId!: string;
  id!: number;
  editDeviceForm!: FormGroup;
  device!: Device;
  viewdevice!: ViewDevice ;
  siteId!: number;
  sitegroup: string | null = null;
  organization: string | null = null;
  site: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private deviceService: DevicesService,
    private sitesService: SitesService,
    private sitegroupsService: SitegroupsService,
    private organizationService: OrganizationsService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.editDeviceForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.deviceService.getDeviceById(this.id).subscribe({
      next: (device: ViewDevice) => {
        this.viewdevice = device;

        this.deviceId=device.deviceId
       // this.getSite(vdevice.siteId);
        this.organization=device.site.siteGroup.organization.name,
        this.site=device.site.name,
        this.sitegroup=device.site.siteGroup.name,
        this.editDeviceForm.patchValue(device)
      },
      error: (error: any) => {
        console.error('Failed to fetch device: ', error);
      },
    });
  }
  
  getSite(siteId: number) {
   this.sitesService.getSiteById(siteId).subscribe({
      next: (site: ViewSite) => {
        console.log('Fetched site:', site);
        this.site = site.name;
        //this.fetchSiteGroupsDetails(site.siteGroupId);
        
       // this.fetchOrganizationsDetails(this.selectedsitegroup!.id);
      },
      error: (error) => {
        console.error('Failed to fetch sitegroup:', error);
      },
    });
  }
  fetchOrganizationsDetails(organizationID: number): void {
    this.organizationService.getOrganizationById(organizationID).subscribe({
      next: (organization: Organization) => {
        console.log('Fetched organization:', organization);
        this.organization = organization.name;
      },
      error: (error: any) => {
        console.error('Failed to fetch organization:', error);
      },
    });
  }

  fetchSiteGroupsDetails(groupId: number): void {
    this.sitegroupsService.getSiteGroupById(groupId).subscribe({
      next: (sitegroup: ViewSiteGroup) => {
        console.log('Fetched sitegroup:', sitegroup);
        this.sitegroup = sitegroup.name;
       // this.fetchOrganizationsDetails(sitegroup.);
      },
      error: (error) => {
        console.error('Failed to fetch sitegroup:', error);
      },
    });

  }


  submitForm() {
    console.log('Submitting form...');
    console.log('is valid', this.editDeviceForm.valid);
    console.log('device data', this.viewdevice);
    

    if (this.editDeviceForm.valid && this.viewdevice) {
      const updatedDeviceData: Device = {
        id: this.id,
        deviceId: this.deviceId,
        name: this.editDeviceForm.value.name,
        siteId: this.viewdevice.site.id,
        thingId: this.viewdevice.thingId,
        thingKey: this.viewdevice.thingKey,
        channelId: this.viewdevice.channelId,
        lastSyncTimestamp: this.viewdevice.lastSyncTimestamp,
        type: 'CONTROL'
        
      };
      console.log('updated data', updatedDeviceData);

      this.deviceService.updateDevice(updatedDeviceData).subscribe({
        next: (response) => {
          console.log('Device updated successfully:', response);
          // Navigate to the appropriate route after update
          this.router.navigate([`/devices/${this.id}`]);
        },
        error: (error) => {
          console.error('Failed to update device:', error);
        },
      });
    }
  }
  cancelEdit() {
    this.router.navigate([`/sites/${this.viewdevice.site.id}`]);
  }
}
