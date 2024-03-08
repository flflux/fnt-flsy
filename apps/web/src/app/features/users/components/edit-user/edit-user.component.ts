import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User, ViewUser } from '@fnt-flsy/data-transfer-types';
import { ActivatedRoute } from '@angular/router';
import { OrganizationsService } from '../../../organizations/services/organizations.service';
import { Organization } from '@fnt-flsy/data-transfer-types';

@Component({
  selector: 'fnt-flsy-edit-user-dialog',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  // userIdToUpdate: number;
  userId!: number;
  userForm!: FormGroup;
  user: User | undefined;
  viewUser: ViewUser | undefined;
  organizations: Organization[] = [];
  organizationId: number | null = null;
  selectedOrganizationId: number | null = null;
  hasSuperRole = false;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private usersService: UsersService
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      organizationRoles: this.formBuilder.array([]),
      superRole: [null],
    });
  }

  ngOnInit(): void {
    this.userId = this.data.id;

    this.fetchOrganizations();
    this.fetchUser();
  }

  fetchUser() {
    this.usersService.getUserById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          this.viewUser = user;
          console.log('user', user);
          this.userForm = this.formBuilder.group({
            firstName: [user.firstName, Validators.required],
            lastName: [user.lastName, Validators.required],
            email: [user.email, [Validators.required, Validators.email]],
            phoneNumber: [user.phoneNumber, Validators.required],
            organizationRoles: this.formBuilder.array([]),
            superRole: [user.superRole ? user.superRole : null],
          });
          const orgRolesArray = this.userForm.get(
            'organizationRoles'
          ) as FormArray;

          user.organizationRoles?.forEach((orgRole) => {
            orgRolesArray.push(
              this.formBuilder.group({
                organizationId: [
                  orgRole?.name,
                  Validators.required,
                ],
                organizationRole: [orgRole?.organizationRole, Validators.required],
              })
            );
          });
          this.hasSuperRole = user.superRole ? true : false;
        } else {
          console.error(`user with ID ${this.userId} not found.`);
        }
      },
      error: (error) => {
        console.error('Failed to fetch user data:', error);
      },
    });
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

  addSuperRole() {
    this.hasSuperRole = true;
  }

  removeSuperRole() {
    this.hasSuperRole = false;
    this.userForm.patchValue({ superRole: null });
  }

  onOrganizationSelected(event: any): void {
    this.selectedOrganizationId = event.value;
  }

  addOrganizationRoles(): void {
    this.organizationRoles?.push(
      this.formBuilder.group({
        organizationId: ['', Validators.required],
        organizationRole: ['', Validators.required],
      })
    );
  }

  get organizationRoles() {
    return this.userForm.get('organizationRoles') as FormArray;
  }

  removeOrganizationRoles(index: number): void {
    this.organizationRoles?.removeAt(index);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.userForm.valid) {
      const userData = {
        id: this.userForm.value.id,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        phoneNumber: this.userForm.value.phoneNumber,
        superRole: this.hasSuperRole
          ? this.userForm.value.superRole
          : undefined,
        organizationRoles: this.userForm.value.organizationRoles.map(
          (role: any) => ({
            organizationId: role.organizationId,
            organizationRole: role.organizationRole,
          })
        ),
      };
      console.log('user data',userData)

      this.usersService.updateUser(this.userId, userData).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.dialogRef.close(userData);
        },
        error: (error) => {
          console.error('Failed to update user:', error);
        },
      });
    }
  }
}
