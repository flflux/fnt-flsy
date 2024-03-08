import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup,  Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SitegroupsService } from '../../services/sitegroups.service';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { AddSiteGroup, SiteGroup } from '@fnt-flsy/data-transfer-types';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'fnt-flsy-add-sitegroup',
  templateUrl: './add-sitegroup.component.html',
  styleUrls: ['./add-sitegroup.component.scss'],
})
export class AddSitegroupComponent implements OnInit {
  addSitegroupForm!: FormGroup;
  organizationId: number | null = null;
  organizations: Organization[] = [];
  selectedOrganizationId: number | null = null;
  sitegroups: MatTableDataSource<SiteGroup>;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private sitegroupService: SitegroupsService
  ) {
    this.sitegroups = new MatTableDataSource<SiteGroup>([]);
  }

  ngOnInit(): void {
    this.addSitegroupForm = this.fb.group({
      name: ['', Validators.required],
      organization: [null, Validators.required],
    });

    this.fetchOrganizations();
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
  }

  onOrganizationSelected(event: any): void {
    this.selectedOrganizationId = event.value;
  }

  submitForm(data: { name: string; organization: number }) {
    if (this.addSitegroupForm.valid) {
      const sitegroupData: Omit<SiteGroup, 'id'> = {
        name: data.name,
        organizationId: data.organization,
      };
      console.log('submit', sitegroupData);
      this.sitegroupService.addSiteGroup(sitegroupData).subscribe({
        next: (sitegroup) => {
          console.log('Sitegroup added successfully:', sitegroup);

          const currentData = this.sitegroups.data;

          this.sitegroups.data = [...currentData, sitegroup];

          this.router.navigate(['sitegroups', sitegroup.id]);
        },
        error: (error) => {
          console.error('Failed to add sitegroup:', error);
        },
      });
    }
  }

  onQueryChange() {
    this.fetchOrganizations();
  }

  // clearSearch() {
  //   this.addSitegroupForm.get('nameFilter')?.setValue('');
  //   this.onQueryChange();
  // }
}
