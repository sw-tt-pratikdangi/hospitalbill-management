import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private baseUrl = 'http://localhost:5141/api/dashboard';

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
    }
}