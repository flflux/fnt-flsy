import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Site, ViewSite } from '@fnt-flsy/data-transfer-types';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SitesService {
  
  private apiUrl = 'http://localhost:3000/sites'; // Base API URL for sites

  constructor(private http: HttpClient
    ) { 
  }
  getFilteredSites(
    pageSize?: number,
    pageOffset?: number,
    searchTerm?: string,
    siteGroupId?: number,
    sortField?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<Site[]> {
    const url = `${this.apiUrl}/`; 

    // Construct your query parameters as needed
    let params = new HttpParams();
    if (pageSize !== undefined) {
      params = params.append('pageSize', pageSize);
    }
    if (pageOffset !== undefined) {
      params = params.append('pageOffset', pageOffset);
    }
    if (sortField !== undefined) {
      params = params.append('sortBy', sortField);
    }
    if (sortOrder !== undefined) {
      params = params.append('sortOrder', sortOrder);
    }
    if (searchTerm !== undefined) {
      params = params.append('name', searchTerm);
    }
    if (siteGroupId !== undefined) {
      params = params.append('siteGroupId', siteGroupId);
    }

    return this.http.get<Site[]>(url, { params });
  }

  getAllSites(): Observable<Site[]> {
    return this.http.get<Site[]>(this.apiUrl); // Request all sites
  }

  addSite(siteData: Omit<Site, 'id'>): Observable<Site> {
    return this.http.post<Site>(this.apiUrl, siteData); // Add a new site
  }

  getSiteById(id: number): Observable<ViewSite> {
    return this.http.get<ViewSite>(`${this.apiUrl}/${id}`); // Request a specific site by ID
  }

  updateSite(siteData: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/${siteData.id}`, siteData); // Update a specific site by ID
  }

  deleteSite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Delete a specific site by ID
  }
}