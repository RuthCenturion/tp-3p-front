import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVICE_REST } from '../commons/app-utils';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    /*private empleadoUrl = SERVICE_REST + 'persona';
    private clienteUrl = SERVICE_REST + 'persona';
    private reservaUrl = SERVICE_REST + 'reserva';
    private fichaClinicaUrl = SERVICE_REST + 'fichaClinica';
    private servicioUrl = SERVICE_REST + 'servicio';*/
    private usuarioUrl = SERVICE_REST + 'persona';

    constructor(private http: HttpClient) { }

    //buscador de usuario
    getUsuario(descripcion): Observable<any> {
        return this.http.get(this.usuarioUrl + descripcion);
    }
}
