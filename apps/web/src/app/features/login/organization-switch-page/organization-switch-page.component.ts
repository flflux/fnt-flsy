import { Component, OnInit } from '@angular/core';
import { User, OrganizationRoleDto } from '@fnt-flsy/data-transfer-types';
import { OrganizationRole, OrganizationRoleName, SuperRole, SuperRoleName } from '@prisma/client';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'fnt-flsy-organization-switch-page',
  templateUrl: './organization-switch-page.component.html',
  styleUrls: ['./organization-switch-page.component.scss'],
})

export class OrganizationSwitchPageComponent implements OnInit {
  user: User | null = null;
  userId: number| undefined
  isDoneLoading = false;

  get hasSuperRoles(): boolean {
    if (this.user) {
      const bool = this.user?.superRole;
      if (bool==undefined) {
        return false
      }
      return true
    } else {
      return false
    }
  }

  get hasOrganizationRoles(): boolean {
    if (this.user == null) {
      return false;
    }
    return this.user.organizationRoles?.length > 0;
  }

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    
    this.user = this.authService.getUserProfile();
    console.log('we got user here',this.user)
    const superRoles = this.user?.superRole;
    const organizationRoles = this.user?.organizationRoles;
    this.userId = this.user?.id
    if ((organizationRoles == null || organizationRoles.length === 0) && superRoles) {
      this.processCurrentRole(superRoles, null, null,this.userId);
    } else if ((!superRoles) && organizationRoles?.length === 1) {
      const role = organizationRoles[0];
      this.processCurrentRole(undefined, role.organizationId, role.organizationRole,this.userId);
    }
    this.isDoneLoading = true;
  }

  handleOrganizationChoiceClick(role: OrganizationRoleDto) {
    this.processCurrentRole(undefined, role.organizationId, role.organizationRole,this.userId);
  }

  handleSuperChoiceClick(role: SuperRoleName) {
    //this.router.navigate(['/dashboard']);
    this.processCurrentRole(role, null, null,this.userId);
  }

  processCurrentRole(superRole: SuperRoleName | undefined, organizationId: number | null, organizationRole: OrganizationRoleName | null, userId:number|undefined) {
    console.log('this function called')
    this.authService.processCurrentRole(superRole, organizationId, organizationRole,userId)
      .subscribe({
        next: _ => {
          this.router.navigate(['/dashboard']);
        }, error: err => {
          console.error(err);
          this.router.navigate(['/login'], { state: { error: '401' } });
        },
      });

  }
}
