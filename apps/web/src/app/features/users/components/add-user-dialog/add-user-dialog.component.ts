import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { Organization } from '@fnt-flsy/data-transfer-types';
import { FormArray } from '@angular/forms'; 

@Component({
  selector: 'fnt-flsy-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent {
  userForm!: FormGroup;
  organizations: Organization[] = [];
  organizationId: number | null = null;
  selectedOrganizationId: number | null = null;
  hasSuperRole = false;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private usersService: UsersService
  ) {
   
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      organizationRoles: this.formBuilder.array([]),
      superRole: []
    });
    this.fetchOrganizations();
    
  }

  fetchOrganizations(): void {
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

  addSuperRole(){
    this.hasSuperRole = true;
  }

  removeSuperRole(){
    this.hasSuperRole=false;
    this.userForm.patchValue({superRole: null})
  }

  onOrganizationSelected(event: any): void {
    this.selectedOrganizationId = event.value;
  }

  addOrganizationRoles(): void {
    this.organizationRoles?.push(
      this.formBuilder.group({
        organizationId: ['', Validators.required],
        organizationRole: ['', Validators.required]
      })
    );
  }

  get organizationRoles(){
    return this.userForm.get('organizationRoles') as FormArray;
  }

  removeOrganizationRoles(index: number): void {
    this.organizationRoles?.removeAt(index);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() {
    console.log('user formm',this.userForm.valid)
    console.log('userForm',this.userForm)
    if (this.userForm.valid) {
      const userData = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        phoneNumber: this.userForm.value.phoneNumber,
       
        superRole: this.hasSuperRole ? this.userForm.value.superRole : undefined,
        organizationRoles: this.userForm.value.organizationRoles.map((role: any) => ({
          organizationId: role.organizationId,
          organizationRole: role.organizationRole,
        })),
      };
      console.log(userData)

      this.usersService.createUser(userData).subscribe({
        next: (response) => {
          console.log('User added successfully:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Failed to add user:', error);
        }
      });
    }
  }
  onQueryChange() {
    this.fetchOrganizations();
  }
}
