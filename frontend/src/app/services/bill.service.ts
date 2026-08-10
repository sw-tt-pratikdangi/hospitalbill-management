import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { Patient } from '../models/patient.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillService {
    private baseUrl = `${environment.apiUrl}/bills`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Bill[]> {
        return this.http.get<Bill[]>(this.baseUrl);
    }

    getById(id: string): Observable<Bill> {
        return this.http.get<Bill>(`${this.baseUrl}/${id}`);
    }

    create(bill: Partial<Bill>): Observable<Bill> {
        return this.http.post<Bill>(this.baseUrl, bill);
    }

    updateStatus(id: string, status: string): Observable<Bill> {
        return this.http.put<Bill>(`${this.baseUrl}/${id}/status`, { status });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}