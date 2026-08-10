import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
    private baseUrl = `${environment.apiUrl}/patients`;

    constructor(private http: HttpClient) { }

    getPatientDropdown(): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${this.baseUrl}/dropdown`);
    }

    getAll(page: number = 1, limit: number = 10) {
        return this.http.get<any>(
            `${this.baseUrl}?page=${page}&limit=${limit}`
        );
    }

    getById(id: string): Observable<Patient> {
        return this.http.get<Patient>(`${this.baseUrl}/${id}`);
    }

    create(patient: Patient): Observable<Patient> {
        return this.http.post<Patient>(this.baseUrl, patient);
    }

    update(id: string, patient: Patient): Observable<Patient> {
        return this.http.put<Patient>(`${this.baseUrl}/${id}`, patient);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}