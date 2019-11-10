import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Classe permettant de communiquer avec l'API RESTful exposée par le backend.
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    readonly API = 'http://sharpink.io:8081/api';

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string, options?: any): Observable<any> {
        if (options) {
            return this.http.get<T>(`${this.API}/${endpoint}`, options);
        } else {
            return this.http.get<T>(`${this.API}/${endpoint}`);
        }
    }

    post(endpoint: string, body: any | null, options?: any): Observable<any> {
        if (options) {
            return this.http.post(`${this.API}/${endpoint}`, body, options);
        } else {
            return this.http.post(`${this.API}/${endpoint}`, body);
        }
    }
}
