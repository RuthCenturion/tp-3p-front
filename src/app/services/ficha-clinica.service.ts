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
export class FichaClinicaService {
    private empleadoUrl = SERVICE_REST + 'persona';
    private clienteUrl = SERVICE_REST + 'persona';
    private reservaUrl = SERVICE_REST + 'reserva';
    private fichaClinicaUrl = SERVICE_REST + 'fichaClinica';

    constructor(private http: HttpClient) { }

    getFichas(): Observable<any> {
        return this.http.get(this.fichaClinicaUrl);
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
    buscarFichas(descripcion): Observable<any> {
        return this.http.get(this.fichaClinicaUrl + descripcion);
    }/*
    buscarAgenda(descripcion): Observable<any> {
        return this.http.get(this.empleadoUrl + descripcion);
    }*/
    agregarFicha(ficha: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'gustavo'
            })
        };
        return this.http.post(this.fichaClinicaUrl, ficha, httpOptions);
    }
      modificarFicha(ficha: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'gustavo'
            })
        };
        return this.http.put(this.fichaClinicaUrl, ficha, httpOptions);
    }
    /*eliminarReserva(id): Observable<any> {
        let httpParams = new HttpParams();
        Object.keys(id).forEach( function(key) {
          httpParams = httpParams.append(key, id[key]);
        });
        return this.http.delete(this.reservaUrl + '/' + id);
      }*/
}
