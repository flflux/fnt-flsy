import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

import { User } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private authService: AuthService) {
  }

  get userCurrent(): User | null {
    return this.authService.getUserCurrent();
  }

  get userProfile(): User | null {
    return this.authService.getUserProfile();
  }

  get hasAnySuperRole(): boolean {
    const u = this.authService.getUserCurrent();
    return u !== null && u.superRole != null;
  }




  getOrganizationName(): number[] | null {
    // return this.authService.getUserCurrent()?.organizationRoles ?? null;
    return this.authService.getUserCurrent()?.organizationRoles?.map(role => role.organizationId) || null;
  }


}


