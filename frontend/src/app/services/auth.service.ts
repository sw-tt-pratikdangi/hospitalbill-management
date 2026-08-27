import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    register(data: { name: string; email: string; password: string; role: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data);
    }

    login(data: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
            tap(res => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getRole(): string | null {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored).role : null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'Admin';
    }

    forgotPassword(email: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { email });
    }

    resetPassword(token: string, password: string): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.baseUrl}/reset-password/${token}`, { password });
    }
}