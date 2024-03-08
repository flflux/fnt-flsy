import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesStates } from '../../../../core/consts/countries-states';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { OrganizationsService } from '../../services/organizations.service';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { BreadcrumbService } from 'xng-breadcrumb';

interface Country {
  name: string;
  code: string;
  phone_code: string;
  states: { name: string; code: string }[];
}

interface State {
  name: string;
  code: string;
}

@Component({
  selector: 'fnt-flsy-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss'],
})
export class EditOrganizationComponent implements OnInit {
  organizationId!: number;
  editForm!: FormGroup;
  organization: Organization | undefined; // Store the organization data here

  selectedCountry: Country | null = null;
  countriesToSelect: Country[] = CountriesStates;
  statesToSelect: State[] = [];
  types = ['School', 'College', 'Society'];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private organizationService: OrganizationsService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.organizationId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryCode: ['', Validators.required],
      stateCode: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
    this.fetchOrganizationData();
  }

  submit() {
    if (this.editForm.valid) {
      const updatedOrganization = this.editForm.value;
      this.organizationService
        .updateOrganization(this.organizationId, updatedOrganization)
        .subscribe({
          next: (next) => {
            this.router.navigate(['/', 'organizations', this.organizationId]);
          },
          error: (error) => {
            console.error('Failed to update organization:', error);
          },
        });
    }
  }

  onCountryChange() {
    const countryCode = this.editForm.get('countryCode')?.value;
    const selectedCountry = this.countriesToSelect.find(
      (country) => country.code === countryCode
    );
    this.statesToSelect = selectedCountry?.states || [];
    this.editForm.patchValue({ stateCode: null });
  }

  private fetchOrganizationData() {
    this.organizationService.getOrganizationById(this.organizationId).subscribe(
      (organization) => {
        if (organization) {
          this.organization = organization;
          this.breadcrumbService.set('@ViewOrganization', organization.name);
          this.editForm.patchValue(this.organization);
          const countryCode = this.editForm.get('countryCode')?.value;
          const selectedCountry = this.countriesToSelect.find(
            (country) => country.code === countryCode
          );
          this.statesToSelect = selectedCountry?.states || [];
        } else {
          console.error(
            `Organization with ID ${this.organizationId} not found.`
          );
        }
      },
      (error) => {
        console.error('Failed to fetch organization data:', error);
      }
    );
  }
}
