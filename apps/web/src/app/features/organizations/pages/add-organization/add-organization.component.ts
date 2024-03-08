import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesStates } from '../../../../core/consts/countries-states';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { OrganizationsService } from '../../services/organizations.service';

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
  selector: 'fnt-flsy-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss'],
})
export class AddOrganizationComponent implements OnInit {
  selectedCountry: Country | null = null;
  countriesToSelect: Country[] = CountriesStates;
  statesToSelect: State[] = [];

  registrationForm!: FormGroup;
  administrativeArea1Code = new FormControl();
  private userIdToUpdate!: number;
  isUpdateActive = true;
  types = ['School', 'College', 'Society'];
  organizationService: OrganizationsService;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationsService: OrganizationsService
  ) {
    this.organizationService = organizationsService;
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
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
  }

  submit() {
    if (this.registrationForm.valid) {
      const organizationData: Omit<Organization, 'id'> = {
        name: this.registrationForm.value.name,
        type: this.registrationForm.value.type,
        email: this.registrationForm.value.email,
        phoneNumber: this.registrationForm.value.phoneNumber,
        addressLine1: this.registrationForm.value.addressLine1,
        addressLine2: this.registrationForm.value.addressLine2,
        countryCode: this.registrationForm.value.countryCode,
        stateCode: this.registrationForm.value.stateCode,
        city: this.registrationForm.value.city,
        postalCode: this.registrationForm.value.postalCode,
      };
      console.log(organizationData);

      this.organizationService.addOrganization(organizationData).subscribe({
        next: (response) => {
          console.log('Organization added successfully:', response);
          this.router.navigate(['/', 'organizations', response.id]);
        },
        error: (error) => {
          console.error('Failed to add organization:', error);
        },
      });
    }
  }

  onCountryChange() {
    const countryCode = this.registrationForm.get('countryCode')?.value;
    const selectedCountry = this.countriesToSelect.find(
      (country) => country.code === countryCode
    );
    this.statesToSelect = selectedCountry?.states || [];
    this.registrationForm.patchValue({ stateCode: null });
  }
}
