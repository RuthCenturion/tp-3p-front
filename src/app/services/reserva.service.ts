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
export class ReservaService {
    private empleadoUrl = SERVICE_REST + 'persona';
    private clienteUrl = SERVICE_REST + 'persona';
    private horarioAtencionUrl = SERVICE_REST + 'personaHorarioAgenda';
    private horarioExcepcionUrl = SERVICE_REST + 'horarioExcepcion';
    private reservaUrl = SERVICE_REST + 'reserva';

    constructor(private http: HttpClient) { }

    getReservas(): Observable<any> {
        return this.http.get(this.reservaUrl);
    }
    //buscador de empleado
    // -por nombre
    // -si tiene idLocalDefecto
    getEmpleadosBuscador(descripcion): Observable<any> {
        return this.http.get(this.empleadoUrl + descripcion);
    }
    getClienteBuscador(descripcion): Observable<any> {
        if (descripcion !== '') {
            return this.http.get(this.clienteUrl + descripcion);
        } else {
            return this.http.get(this.clienteUrl);
        }
    }
    buscarReservas(descripcion): Observable<any> {
        return this.http.get(this.reservaUrl + descripcion);
    }
}