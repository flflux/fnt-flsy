import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SitegroupsService } from '../../services/sitegroups.service';
import { SiteGroup, ViewSiteGroup } from '@fnt-flsy/data-transfer-types';
import { OrganizationsService } from '../../../organizations/services/organizations.service';

@Component({
  selector: 'fnt-flsy-edit-sitegroup',
  templateUrl: './edit-sitegroup.component.html',
  styleUrls: ['./edit-sitegroup.component.scss'],
})
export class EditSitegroupComponent implements OnInit {
  sitegroupId!: number;
  organizationId!:number;
  editSitegroupForm!: FormGroup;
  sitegroup: SiteGroup | null = null;
  organizationName: string | null = null;
  viewSiteGroup!: ViewSiteGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sitegroupService: SitegroupsService,
    private organizationService: OrganizationsService
  ) {}

  ngOnInit(): void {
    this.sitegroupId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    //this.organizationName = this.activatedRoute.snapshot.paramMap.get('id')
    this.editSitegroupForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.sitegroupService.getSiteGroupById(this.sitegroupId).subscribe({
      next: (sitegroup:ViewSiteGroup) => {
        console.log('Fetched sitegroup:', sitegroup);
// Assign the fetched sitegroup to this.sitegroup
      this.viewSiteGroup = sitegroup;
      
        this.organizationService
          .getOrganizationById(sitegroup.organization.id)
          .subscribe({
            next: (organization: any) => {
              this.organizationName = organization.name;
              this.organizationId = organization.id
            },
            error: (error: any) => {
              console.error('Failed to fetch organization:', error);
            },
          });

        this.editSitegroupForm.patchValue({
          name: sitegroup.name,
        });
      },
      error: (error: any) => {
        console.error('Failed to fetch sitegroup:', error);
      },
    });

    console.log('inside sitedata', this.editSitegroupForm);
    //this.organizationName=
  }

  submitForm() {
    console.log('Submitting form...');
    console.log('is true', this.editSitegroupForm.valid);
    console.log('site data', this.viewSiteGroup);

    if (this.editSitegroupForm.valid && this.viewSiteGroup) {
      const updatedSitegroupData: SiteGroup = {
        id: this.sitegroupId,
        name: this.editSitegroupForm.value.name,
        organizationId: this.viewSiteGroup?.organization.id,
      };
      console.log('updated data', updatedSitegroupData);

      this.sitegroupService.updateSiteGroup(updatedSitegroupData).subscribe({
        next: (response) => {
          console.log('Sitegroup updated successfully:', response);
          this.router.navigate([`/sitegroups/${this.sitegroupId}`]);
        },
        error: (error) => {
          console.error('Failed to update sitegroup:', error);
        },
      });
    }
  }
  goToListPage() {
    this.router.navigate([`/organizations/${this.organizationId}`]);
  }
}
