import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
    private baseUrl = 'http://localhost:5141/api/services';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Service[]> {
        return this.http.get<Service[]>(this.baseUrl);
    }

    getById(id: string): Observable<Service> {
        return this.http.get<Service>(`${this.baseUrl}/${id}`);
    }

    create(service: Service): Observable<Service> {
        return this.http.post<Service>(this.baseUrl, service);
    }

    update(id: string, service: Service): Observable<Service> {
        return this.http.put<Service>(`${this.baseUrl}/${id}`, service);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}