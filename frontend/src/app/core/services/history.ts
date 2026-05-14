import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedById: string;
  performedByName: string;
  performedByRole: string;
  details: Record<string, any>;
  createdAt: string;
}

export interface AuditResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLogs(
    page = 1,
    limit = 20,
    action = '',
    search = '',
  ): Observable<AuditResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (action) params = params.set('action', action);
    if (search) params = params.set('search', search);
    return this.http.get<AuditResponse>(`${this.apiUrl}/audit`, { params });
  }
}
