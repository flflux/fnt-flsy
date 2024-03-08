import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SitesService } from '../../services/sites.service';
import { Site } from '@fnt-flsy/data-transfer-types';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'fnt-flsy-list-sites',
  templateUrl: './list-sites.component.html',
  styleUrls: ['./list-sites.component.scss'],
})
export class ListSitesComponent implements OnInit {
  itecolumns: string[] = ['name', 'edit']; 
  organizationId: number | null = null;
  siteGroupId: number | null=null;
  dataSource: MatTableDataSource<Site> = new MatTableDataSource<Site>([]); 
  pageSize = 10;
  pageOffset = 0;
  nameFilter = '';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  constructor(private router: Router, private sitesService: SitesService) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.sitesService.getFilteredSites(  
      this.pageSize,
      this.pageOffset,
      this.nameFilter,
      this.siteGroupId!,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next:(sites: any) => {
        this.dataSource.data = sites.content; 
      },
      error:(error) => {
        console.error('Error fetching sites:', error);
      }
  });
  }

  goToAddSite() {
    this.router.navigate(['/sites', 'add']);
  }

  editSite(siteId: number) {
    this.router.navigate(['/sites', 'edit', siteId]);
  }

  deleteSite(siteId: number) {
    this.sitesService.deleteSite(siteId).subscribe(
      () => {
        this.loadSites();
      },
      (error) => {
        console.error('Error deleting site:', error);
      }
    );
  }
}
