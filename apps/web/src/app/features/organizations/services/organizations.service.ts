import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizations`);
  }

  getFilteredOrganizations(
    pageSize?: number,
    pageOffset?: number,
    name?: string,
    type?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<any> {
    let params = new HttpParams();
    if (pageSize !== undefined) {
      params = params.append('pageSize', pageSize);
    }
    if (pageOffset !== undefined) {
      params = params.append('pageOffset', pageOffset);
    }
    if (sortBy !== undefined) {
      params = params.append('sortBy', sortBy);
    }
    if (sortOrder !== undefined) {
      params = params.append('sortOrder', sortOrder);
    }
    if (name !== undefined) {
      params = params.append('name', name);
    }
    if (type !== undefined) {
      params = params.append('type', type);
    }
    console.log('params', params);
    return this.http.get<any>(`${this.apiUrl}/organizations`, { params });
  }

  // Add an organization to the backend
  addOrganization(
    organization: Omit<Organization, 'id'>
  ): Observable<Organization> {
    return this.http.post<Organization>(
      `${this.apiUrl}/organizations/`,
      organization
    );
  }

  // Fetch an organization by ID from the backend
  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organizations/${id}`);
  }

  // Update an organization in the backend
  updateOrganization(
    id: number,
    organization: Organization
  ): Observable<Organization> {
    return this.http.put<Organization>(
      `${this.apiUrl}/organizations/${id}`,
      organization
    );
  }

  // Delete an organization from the backend
  deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/organizations/${id}`);
  }

  clearOrganizations() {
    localStorage.removeItem('organizations');
  }
}
