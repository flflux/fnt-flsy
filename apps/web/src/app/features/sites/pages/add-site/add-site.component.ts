import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SitesService } from '../../services/sites.service';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { MatTableDataSource } from '@angular/material/table';
import { SiteGroup } from '@fnt-flsy/data-transfer-types';
import { Site } from '@fnt-flsy/data-transfer-types';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { SitegroupsService } from '../../../sitegroups/services/sitegroups.service';
@Component({
  selector: 'fnt-flsy-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss'],
})
export class AddSiteComponent implements OnInit {
  addSiteForm!: FormGroup;
  organizationId: number | 0=0;

  organizations: Organization[] = [];
  selectedOrganizationId: number | null = null;
  sitegroups: SiteGroup[]=[];
  selectedSiteGroupId: number | null = null;
  sites: MatTableDataSource<Site>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private organizationsService: OrganizationsService,
    private siteGroupService: SitegroupsService,
    private sitesService: SitesService
  ) {
    this.sites = new MatTableDataSource<Site>([]);

  }

  ngOnInit(): void {
    this.addSiteForm = this.fb.group({
      organizationId: [null, Validators.required],
      siteGroupId: [null, Validators.required],
      name: ['', Validators.required],
    });
    this.fetchOrganizations();
    this.addSiteForm.get('organizationId')?.valueChanges.subscribe((organizationId) => {
      this.fetchSiteGroups(organizationId);
    });
    console.log(' DATA CHECK ',this.addSiteForm)
  }

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
  }

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
  }

  submitForm(data: { name: string; siteGroupId: number }): void {
    if (this.addSiteForm.valid) {
      const siteData: Omit<Site, 'id'> = {
        siteGroupId: data.siteGroupId,
        name: data.name,
      };

      this.sitesService.addSite(siteData).subscribe({
        next: (site: any) => {
          console.log('Site added successfully:', site);
          this.router.navigate(['sites', site.id]);
        },
        error: (error: any) => {
          console.error('Failed to add site:', error);
        },
      });
    }
  }
onQueryChange() {
  this.fetchOrganizations();
}
}
