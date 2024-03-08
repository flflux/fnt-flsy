import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ViewUser } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';
  getOrganizations: any;

  constructor(private http: HttpClient) {}

  getUsers(
    pageSize?: number,
    pageOffset?: number,
    email?: string,
    
    firstName?: string,
    lastName?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<any> {
    let params = new HttpParams();
    if (pageSize !== undefined) {
      params = params.append('pageSize', pageSize.toString());
    }
    if (pageOffset !== undefined) {
      params = params.append('pageOffset', pageOffset.toString());
    }
    if (email !== undefined) {
      params = params.append('email', email);
    }
    if (firstName !== undefined) {
      params = params.append('name', firstName);
    }
    if (lastName !== undefined) {
      params = params.append('lastName', lastName);
    }
    if (sortBy !== undefined) {
      params = params.append('sortBy', sortBy);
    }
    if (sortOrder !== undefined) {
      params = params.append('sortOrder', sortOrder);
    }

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }

  addUser(userData: any): Observable<any> {
    const url = `${this.apiUrl}/users`;
    return this.http.post(url, userData);
  }
  
  getUserById(id: number): Observable<ViewUser> {
    return this.http.get<ViewUser>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
