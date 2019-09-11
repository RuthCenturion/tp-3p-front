import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVICE_REST, API_HOST } from '../commons/app-utils';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable({
    providedIn: 'root'
})

export class HorarioService {

    private horarioAtencionUrl = SERVICE_REST + 'personaHorarioAgenda';

    constructor(private http: HttpClient) { }

    // --------------------- CATEGORIAS ---------------------
    getHorarioAtencion(): Observable<any> {
        return this.http.get(this.horarioAtencionUrl);
    }

}
