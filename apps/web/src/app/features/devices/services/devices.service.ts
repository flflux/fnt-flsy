import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddDevice, Device } from '@fnt-flsy/data-transfer-types';
import { Observable } from 'rxjs';
import { ViewDevice } from '@fnt-flsy/data-transfer-types';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private apiUrl = 'http://localhost:3000/devices'; // Base API URL for sites

  constructor(private http: HttpClient) { }

  getFilteredDevices(
    pageSize?: number,
    pageOffset?: number,
    searchTerm?: string,
    siteId?: number,
    sortField?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<AddDevice[]> {
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
    if (siteId !== undefined) {
      params = params.append('siteId', siteId);
    }

    return this.http.get<AddDevice[]>(url, { params });
  }


getAllDevice(): Observable<Device[]> {
  return this.http.get<Device[]>(this.apiUrl); // Request all sites
}

addDevice(deviceData: Omit<AddDevice, 'id'>): Observable<AddDevice> {
  return this.http.post<AddDevice>(this.apiUrl, deviceData); // Add a new site
}

getDeviceById(id: number): Observable<ViewDevice> {
  return this.http.get<ViewDevice>(`${this.apiUrl}/${id}`); // Request a specific site by ID
}

updateDevice(deviceData: Device): Observable<Device> {
  return this.http.put<Device>(`${this.apiUrl}/${deviceData.id}`, deviceData); // Update a specific site by ID
}

deleteDevice(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`); // Delete a specific site by ID
}
}
