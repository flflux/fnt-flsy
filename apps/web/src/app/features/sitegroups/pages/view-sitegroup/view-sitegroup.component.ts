import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SitegroupsService } from '../../services/sitegroups.service';
import { ViewSiteGroup,SiteGroup } from '@fnt-flsy/data-transfer-types';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SitesService } from '../../../sites/services/sites.service'; 
import { MatTableDataSource } from '@angular/material/table';
import { ViewSite,Site } from '@fnt-flsy/data-transfer-types';
@Component({
  selector: 'fnt-flsy-view-sitegroup',
  templateUrl: './view-sitegroup.component.html',
  styleUrls: ['./view-sitegroup.component.scss'],
})
export class ViewSitegroupComponent implements OnInit, OnDestroy {
  sitegroup: ViewSiteGroup | null = null;
  groupId!: number;
  selectedsitegroup: SiteGroup | null = null;

  private subscription!: Subscription;
  sites: MatTableDataSource<Site> = new MatTableDataSource<Site>([]); 
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  sitesPageSize = 10;
  sitesPageOffset = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sitegroupService: SitegroupsService,
    private sitesService: SitesService 

  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.fetchSitesDetails();
    //this.fetchSites(this.groupId); 

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onPageChange(event: PageEvent) {
    this.sitesPageOffset = event.pageIndex;
    this.sitesPageSize = event.pageSize;
    this.fetchSites(this.selectedsitegroup!.id);
  }
  fetchSites(id: number): void {
    console.log('function called',id)
    this.sitesService.getFilteredSites(
      this.sitesPageSize,
      this.sitesPageOffset,
      '',
      id, 
      'name',
      'asc'
    ).subscribe({
      next: (sites: any) => {
        console.log('Fetched sites:', sites);
        this.sites.data = sites.content;
        this.totalItems = sites.total;
      },
      error: (error: any) => {
        console.error('Failed to fetch sites:', error);
      },
    });
  }

  fetchSitesDetails(): void {
    this.subscription = this.sitegroupService.getSiteGroupById(this.groupId).subscribe({
      next: (sitegroup:any) => {
        console.log('Fetched sitegroup:', sitegroup);
        this.sitegroup = sitegroup;
        this.selectedsitegroup = sitegroup;
      },
      error: (error) => {
        console.error('Failed to fetch sitegroup:', error);
      }
    });
    this.fetchSites(this.groupId); 

  }

  deleteSitegroup() {
    this.sitegroupService.deleteSiteGroup(this.groupId).subscribe(
      () => {
        console.log('Sitegroup deleted successfully.');
        this.router.navigate(['/organizations/']);
      },
      (error) => {
        console.error('Failed to delete sitegroup:', error);
      }
    );
  }
  goToListPage() {
    this.router.navigate([`/organizations/${this.sitegroup?.organization.id}`]);
  }
}
