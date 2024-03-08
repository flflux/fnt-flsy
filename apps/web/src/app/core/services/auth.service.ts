import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, ViewUser } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userProfileKey = 'user-profile';
  private userCurrentKey = 'user-current';
  prisma: any;
  userId :number | null = null;

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<User> {
    const loginData = { email, password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.post<
      User
    >(`${this.apiUrl}/login`, loginData, httpOptions);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  processCurrentRole(superRole: string | undefined, organizationId: number | null, organizationRole: string | null, userId:number|undefined) {
    let params = new HttpParams();
    if (superRole) {
      params = params.append('superRole', superRole);
    }
    if (organizationId) {
      params = params.append('organizationId', organizationId.toString());
    }
    if (organizationRole) {
      params = params.append('organizationRole', organizationRole);
    }
    console.log('user id',userId)
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, { params })
      .pipe(map(u => {
        this.setUserCurrent(u);
        return u;
      }));
  }


  getUserProfile(): User | null {
    console.log('function Clled')
    const userFrom = sessionStorage.getItem(this.userProfileKey);
    console.log('function Clled user form',userFrom)
    if (userFrom == null) {
      return null;
    }
    return JSON.parse(userFrom);
  }

  setUserProfile(user: User) {
    if (user !== null) {console.log('profile ',JSON.stringify(user))
      sessionStorage.setItem(this.userProfileKey, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(this.userProfileKey);
    }
  }

  getUserCurrent(): User | null {
    const userFrom = sessionStorage.getItem(this.userCurrentKey);
    if (userFrom == null) {
      return null;
    }
    return JSON.parse(userFrom);
  }

    
  setUserCurrent(user: User | null) {
    if (user !== null) {
      sessionStorage.setItem(this.userCurrentKey, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(this.userCurrentKey);
    }
  }

  

}
