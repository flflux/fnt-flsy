import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SitegroupsService } from './../../services/sitegroups.service';
import { ListSiteGroup } from '@fnt-flsy/data-transfer-types';

interface Sitegroup {
  id: number;
  name: string;
}

@Component({
  selector: 'fnt-flsy-list-sitegroups',
  templateUrl: './list-sitegroups.component.html',
  styleUrls: ['./list-sitegroups.component.scss'],
})
export class ListSitegroupsComponent implements OnInit {
  sitegroups: Sitegroup[] = [];
  organizationId: number | null = null;
  pageSize = 10;
  pageOffset = 0;
  nameFilter = '';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    private sitegroupService: SitegroupsService
  ) {}

  ngOnInit(): void {
    this.organizationId = this.getOrganizationIdFromRoute();
    this.loadSiteGroups(); 
  }

  loadSiteGroups() {
    this.sitegroupService.getFilteredSiteGroups(
      this.pageSize,
      this.pageOffset,
      this.nameFilter,
      this.organizationId!,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (sitegroups: any) => {
        this.sitegroups = sitegroups.content;
      },
      error: (error) => {
        console.error('Failed to fetch site groups:', error);
      },
    });
  }

  getOrganizationIdFromRoute(): number | null {
    const idParam = this.router?.routerState?.snapshot?.url?.split('/')?.[2];
    return idParam ? +idParam : null;
  }

  deleteSitegroup(sitegroupId: number) {
    this.sitegroupService.deleteSiteGroup(sitegroupId).subscribe({
      next: () => {
        this.loadSiteGroups();
      },
      error: (error) => {
        console.error('Failed to delete site group:', error);
      },
    });
  }

  applyFilters() {
    this.pageOffset = 0;
    this.loadSiteGroups();
  }

  editSitegroup(sitegroupId: number) {
    this.router.navigate(['/sitegroups/edit', sitegroupId]);
  }
}
