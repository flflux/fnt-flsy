import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { OrganizationsService } from '../../services/organizations.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'fnt-flsy-list-organizations',
  templateUrl: './list-organizations.component.html',
  styleUrls: ['./list-organizations.component.scss'],
})
export class ListOrganizationsComponent implements OnInit {
  organizations: MatTableDataSource<Organization>;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  pageOffset = 0;
  nameFilter = '';
  typeFilter: string | undefined = undefined;
  typeOptions: string[] = ['School', 'College', 'Society'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private organizationService: OrganizationsService,
    private router: Router
  ) {
    this.organizations = new MatTableDataSource<Organization>([]);
  }

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.organizationService
      .getFilteredOrganizations(
        this.pageSize,
        this.pageOffset,
        this.nameFilter,
        this.typeFilter ?? '',
        'name',
        'asc'
      )
      .subscribe({
        next: (organizations: any) => {
          this.organizations.data = organizations.content;
          this.totalItems = organizations.total;
        },
        error: (error) => {
          console.error('Error fetching organizations:', error);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageOffset = event.pageIndex;
    console.log('pageOffset', this.pageOffset);
    this.loadOrganizations();
  }

  onQueryChange() {
    this.pageOffset = 0; // Reset the page offset to the first page
    this.paginator.pageIndex = 0; // Reset the paginator's page index to 0
    this.loadOrganizations();
  }

  clearSearch() {
    this.nameFilter = '';
    this.pageOffset = 0; // Reset the page offset to the first page
    this.paginator.pageIndex = 0; // Reset the paginator's page index to 0

    this.onQueryChange();
  }
}
