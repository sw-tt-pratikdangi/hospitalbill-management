import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface AssistantResponse {
    answer: string;
}

@Injectable({
    providedIn: 'root'
})
export class AssistantService {
    private apiUrl = `${environment.apiUrl}/assistant/ask`;

    constructor(private http: HttpClient) { }

    ask(question: string, codeContext: string): Observable<AssistantResponse> {
        return this.http.post<AssistantResponse>(this.apiUrl, { question, codeContext });
    }
}