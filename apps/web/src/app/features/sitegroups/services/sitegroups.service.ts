import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteGroup, ViewSiteGroup } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root',
})
export class SitegroupsService {
  getOrganizations() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Fetch all site groups from the backend
  getAllSiteGroups(): Observable<SiteGroup[]> {
    return this.http.get<SiteGroup[]>(`${this.apiUrl}/site-groups`);
  }

  // Add a site group to the backend
  addSiteGroup(sitegroup: Omit<SiteGroup, 'id'>): Observable<SiteGroup> {
    return this.http.post<SiteGroup>(`${this.apiUrl}/site-groups`, sitegroup);
  }

  // Fetch site groups for an organization from the backend
  getSitegroupsForOrganization(
    organizationId: number
  ): Observable<SiteGroup[]> {
    const params = new HttpParams().set(
      'organizationId',
      organizationId.toString()
    );
    return this.http.get<SiteGroup[]>(`${this.apiUrl}/site-groups`, { params });
  }

  // Fetch a site group by ID from the backend
  getSiteGroupById(id: number): Observable<ViewSiteGroup> {
    return this.http.get<ViewSiteGroup>(`${this.apiUrl}/site-groups/${id}`);
  }

  // Update a site group in the backend
  updateSiteGroup(sitegroupData: SiteGroup): Observable<SiteGroup> {
    return this.http.put<SiteGroup>(
      `${this.apiUrl}/site-groups/${sitegroupData.id}`,
      sitegroupData
    );
  }

  // Delete a site group from the backend
  deleteSiteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/site-groups/${id}`);
  }

  // Fetch filtered site groups based on parameters
  getFilteredSiteGroups(
    pageSize?: number,
    pageOffset?: number,
    name?: string,
    organizationId?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<SiteGroup[]> {
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
    if (organizationId !== undefined) {
      params = params.append('organizationId', organizationId);
    }
    return this.http.get<SiteGroup[]>(`${this.apiUrl}/site-groups`, { params });
  }

  clearSiteGroups() {
    localStorage.removeItem('sitegroups');
  }
}
