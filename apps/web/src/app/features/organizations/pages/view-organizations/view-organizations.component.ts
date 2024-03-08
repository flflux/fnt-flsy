import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationsService } from '../../services/organizations.service';
import { SiteGroup } from '@fnt-flsy/data-transfer-types';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SitegroupsService } from '../../../sitegroups/services/sitegroups.service';
import { DeleteConfirmationDialogComponent } from '../DeleteConfirmationDialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'fnt-flsy-view-organizations',
  templateUrl: './view-organizations.component.html',
  styleUrls: ['./view-organizations.component.scss'],
})
export class ViewOrganizationsComponent implements OnInit {
  organizations: MatTableDataSource<Organization>;
  sitegroups: MatTableDataSource<SiteGroup>;
  selectedOrganization: Organization | null = null;
  id: number | null = null;
  sitegroupsService: SitegroupsService;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;
  totalItems = 0;
  sitegroupsPageSize = 10;
  sitegroupsPageOffset = 0;

  constructor(
    private organizationService: OrganizationsService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private dialog: MatDialog,
    private sitegroupService: SitegroupsService
  ) {
    this.organizations = new MatTableDataSource<Organization>([]);
    this.sitegroups = new MatTableDataSource<SiteGroup>([]);
    this.sitegroupsService = sitegroupService;
  }

  fetchSitegroups(organizationID: number): void {
    this.sitegroupService
      .getFilteredSiteGroups(
        this.sitegroupsPageSize,
        this.sitegroupsPageOffset,
        '',
        organizationID,
        'name',
        'asc'
      )
      .subscribe({
        next: (sitegroups: any) => {
          console.log('Sitegroups retrieved successfully:', sitegroups);
          this.sitegroups.data = sitegroups.content;
          this.totalItems = sitegroups.total;
        },
        error: (error: any) => {
          console.error('Failed to retrieve sitegroups:', error);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.sitegroupsPageOffset = event.pageIndex;
    this.sitegroupsPageSize = event.pageSize;
    this.fetchSitegroups(this.selectedOrganization!.id);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.fetchOrganization(id);
      this.fetchSitegroups(id);
    }
    this.breadcrumbService.set('@ViewOrganization', 'View');
  }

  fetchOrganization(id: number): void {
    this.organizationService.getOrganizationById(id).subscribe({
      next: (organization) => {
        console.log('Organization retrieved successfully:', organization);
        this.organizations.data = [organization];
        this.selectedOrganization = organization;
      },
      error: (error) => {
        console.error('Failed to retrieve organization:', error);
      },
    });
  }

  deleteOrganization(id: number): void {
    if (id) {
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.organizationService.deleteOrganization(id).subscribe({
            next: () => {
              console.log('Organization deleted successfully');
              this.organizations.data = this.organizations.data.filter(
                (org) => org.id !== id
              );
              this.router.navigate(['/organizations']);
            },
            error: (error) => {
              console.error('Error deleting organization:', error);
            },
          });
        }
      });
    }
  }

  navigateToSitegroup(sitegroupId: number): void {
    this.router.navigate(['/sitegroups/', sitegroupId]);
  }

  goToAddSitegroup() {
    this.router.navigate(['/sitegroups/add']);
  }

  goToListPage() {
    this.router.navigate(['/organizations']);
  }
  goToEditPage(){
    this.router.navigate([`/organizations/${this.selectedOrganization?.id}/edit`])
  }
}
