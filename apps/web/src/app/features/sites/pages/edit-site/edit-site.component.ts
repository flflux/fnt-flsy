import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SitesService } from '../../services/sites.service';
import { Site, ViewSite } from '@fnt-flsy/data-transfer-types';

@Component({
  selector: 'fnt-flsy-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
})
export class EditSiteComponent implements OnInit {
  siteId!: number;
  editSiteForm!: FormGroup;
  site: Site | null = null;
  viewSite!: ViewSite 


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private siteService: SitesService
  ) {}

  ngOnInit(): void {
    this.siteId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.editSiteForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.siteService.getSiteById(this.siteId).subscribe((site: ViewSite) => {
      this.viewSite = site;
      this.editSiteForm.patchValue({
        name: site.name,
      });
    });
  }

  submitForm() {
    console.log('Submitting form...');
    console.log('is valid', this.editSiteForm.valid);
    console.log('site data', this.viewSite);

    if (this.editSiteForm.valid && this.viewSite) {
      const updatedSiteData: Site = {
        id: this.siteId,
        name: this.editSiteForm.value.name,
        siteGroupId: this.viewSite?.siteGroup.id,
    
      };
      console.log('updated data', updatedSiteData);

      this.siteService.updateSite(updatedSiteData).subscribe({
        next: (response) => {
          console.log('Site updated successfully:', response);
          // Navigate to the appropriate route after update
          this.router.navigate([`/sites/${this.siteId}`]);
        },
        error: (error) => {
          console.error('Failed to update site:', error);
        },
      });
    }
  }

  cancelEdit() {
    this.router.navigate([`/sites/${this.siteId}`]);
  }
}
