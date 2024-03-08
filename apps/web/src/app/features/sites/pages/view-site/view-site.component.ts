import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SitesService } from '../../services/sites.service';
import { ViewSite,Site } from '@fnt-flsy/data-transfer-types';
import { Device } from '@fnt-flsy/data-transfer-types';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../devices/services/devices.service';
@Component({
  selector: 'fnt-flsy-view-site',
  templateUrl: './view-site.component.html',
  styleUrls: ['./view-site.component.scss'],
})
export class ViewSiteComponent implements OnInit {
  siteId!: number;
  site: Site | null = null;
  viewSite: ViewSite | null = null;

  private subscription!: Subscription;
  devices: MatTableDataSource<Device> = new MatTableDataSource<Device>([]);
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  devicesPageSize = 10;
  devicesPageOffset = 0;
  organizationsService: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sitesService: SitesService,
    private deviceService: DevicesService
  ) {}

  ngOnInit(): void {
    this.siteId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.fetchSiteDetails(this.siteId);
    this.fetchDevices(this.siteId);
    console.log(this.siteId);
  }

  // fetchSiteDetails(siteId: number): void {
  //   this.sitesService.getSiteById(this.siteId).subscribe({
  //     next: (site: site) => {
  //       console.log('Fetched site:', site);
  //       this.site = site;
  //       this.fetchSitegroupDetails(site.groupId);
  //     },
  //     error: (error) => {
  //       console.error('Failed to fetch site:', error);
  //     }
  //   });
  // }

  fetchSiteDetails(siteId: number): void {
    this.sitesService.getSiteById(siteId).subscribe({
      next: (site: ViewSite) => {
        console.log('Fetched site:', site);
        this.viewSite = site;
    },
      error: (error) => {
        console.error('Failed to fetch sitegroup:', error);
      },
    });
  }
  onPageChange(event: PageEvent) {
    this.devicesPageOffset = event.pageIndex;
    this.devicesPageSize = event.pageSize;
    this.fetchDevices(this.siteId);
  }
  fetchDevices(id: number): void {
    console.log('function called', id);
    this.deviceService
      .getFilteredDevices(
        this.devicesPageSize,
        this.devicesPageOffset,
        '',
        id,
        'name',
        'asc'
      )
      .subscribe({
        next: (devices: any) => {
          console.log('Fetched sites:', devices);
          this.devices.data = devices.content;
          this.totalItems = devices.total;
        },
        error: (error: any) => {
          console.error('Failed to fetch sites:', error);
        },
      });
  }

  goToListPage() {
    this.router.navigate([`/sitegroups/${this.viewSite?.siteGroup.id}`]);
  }
}
