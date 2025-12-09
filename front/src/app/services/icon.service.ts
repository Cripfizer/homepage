import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Icon } from '../models/icon.model';
import { environment } from '../../environments/environment';

interface HydraCollection {
  'member': any[];
  'totalItems': number;
  'hydra:member'?: any[]; // Fallback for older API Platform versions
  'hydra:totalItems'?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/icons`;

  getIcons(parentId?: number): Observable<Icon[]> {
    let url = this.apiUrl;
    if (parentId !== undefined) {
      url += `?parent=${parentId}`;
    }

    return this.http.get<HydraCollection>(url).pipe(
      map(response => {
        console.log('Raw API response:', response);
        // Try both 'member' and 'hydra:member' for compatibility
        const items = response['member'] || response['hydra:member'] || [];
        console.log('Extracted items:', items);
        return items as Icon[];
      })
    );
  }

  getIcon(id: number): Observable<Icon> {
    return this.http.get<Icon>(`${this.apiUrl}/${id}`);
  }

  createIcon(icon: Icon): Observable<Icon> {
    return this.http.post<Icon>(this.apiUrl, icon);
  }

  updateIcon(id: number, icon: Partial<Icon>): Observable<Icon> {
    return this.http.put<Icon>(`${this.apiUrl}/${id}`, icon);
  }

  deleteIcon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorderIcons(updates: { id: number; position: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reorder`, { updates });
  }

  uploadImage(iconId: number, file: File): Observable<Icon> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Icon>(`${this.apiUrl}/${iconId}/upload`, formData);
  }
}
