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
export class ServicioService {
    private empleadoUrl = SERVICE_REST + 'persona';
    private clienteUrl = SERVICE_REST + 'persona';
    private reservaUrl = SERVICE_REST + 'reserva';
    private fichaClinicaUrl = SERVICE_REST + 'fichaClinica';
    private servicioUrl = SERVICE_REST + 'servicio';

    constructor(private http: HttpClient) { }

    getServicios(): Observable<any> {
        return this.http.get(this.servicioUrl);
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
    buscarServicios(descripcion): Observable<any> {
        return this.http.get(this.servicioUrl + descripcion);
    }
    agregarServicio(servicio: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'ana'
            })
        };
        return this.http.post(this.servicioUrl, servicio, httpOptions);
    }
    modificarServicio(descripcion: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'ana'
            })
        };
        return this.http.put(this.servicioUrl, descripcion, httpOptions);
    }
    getFichasAsociadas(descripcion): Observable<any> {
        return this.http.get(this.fichaClinicaUrl  + descripcion);
    }
    listarDetallesDelServicio(descripcion): Observable<any> {
        return this.http.get(this.servicioUrl  + descripcion);
    }
    agregarDetalle(url, dato): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'ana'
            })
        };
        return this.http.post(this.servicioUrl + url, dato, httpOptions);
    }
    eliminarDetalle(descripcion): Observable<any> {
        let httpParams = new HttpParams();
        /*Object.keys(id).forEach( function(key) {
            httpParams = httpParams.append(key, id[key]);
        });*/
        return this.http.delete(this.servicioUrl + descripcion);
    }
}
