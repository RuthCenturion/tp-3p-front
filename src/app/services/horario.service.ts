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

export class HorarioService {
    private empleadoUrl = SERVICE_REST + 'persona';
    private horarioAtencionUrl = SERVICE_REST + 'personaHorarioAgenda';
    private horarioExcepcionUrl = SERVICE_REST + 'horarioExcepcion';
    private urlBase = 'http://gy7228.myfoscam.org:8080/rest/';
    private clienteUrl = this.urlBase + 'clientes';
    private bolsaPuntosUrl = this.urlBase +'bolsas'
    private conceptoUrl = this.urlBase +'vales';
    private reglasUrl = this.urlBase +'reglas'
    
    
    constructor(private http: HttpClient) { }
    // ----------------------------------
    getClienteBuscadorPaginado(url): Observable<any> {
        return this.http.get(this.clienteUrl + url);
    }
    // retorna todos o los clientes según opcion de filtro
    getClienteBuscador( filtro): Observable<any> {
        let param = {
            "startIndexPage": 0,
            "pageSize": 10
        }
        if (filtro !== '') {
            return this.http.post(this.clienteUrl + '/getByPage' + filtro, param);
        } else {
            return this.http.get(this.clienteUrl +'/all');
        }
    }
    agregarUsoPuntos(uso: any): Observable<any> {
      /*  const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'gustavo'
            })
        };*/
        return this.http.post(this.bolsaPuntosUrl+'/add', uso/*, httpOptions*/);
    }
    // retorna todos los conceptos
    getConceptoBuscador( filtro): Observable<any> {
        let param = {
            "startIndexPage": 0,
            "pageSize": 10
        }
        if (filtro !== '') {
            return this.http.post(this.conceptoUrl + '/getByPage' + filtro, param);
        } else {
            return this.http.get(this.conceptoUrl +'/all');
        }
    }
    // retorna el uso creado
    agregarUsoPuntosBolsa(uso: any): Observable<any> {
        return this.http.put(this.bolsaPuntosUrl+'/use', uso);
    }
    // retorna la equivalencia de puntos de monto enviado como parámetro
    consultarEquivalencia(montoEquivalencia): Observable<any> {
        return this.http.get(this.reglasUrl+'/equivalencia/' + montoEquivalencia);        
    }

    // --------------------- CATEGORIAS ---------------------
    getHorarioAtencion(): Observable<any> {
        return this.http.get(this.horarioAtencionUrl);
    }

    listarEmpleados(): Observable<any> {
        return this.http.get(this.empleadoUrl);
    }
    // ----------------------------------ATENCIÓN-----------------------------------------------------
    agregarHorarioAtencion(horarioAtencion: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'gustavo'
            })
        };
        return this.http.post(this.horarioAtencionUrl, horarioAtencion, httpOptions);
    }
    modificarHorarioAtencion(horarioAtencion: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'/*,
              'usuario': 'gustavo'*/
            })
        };
        return this.http.post(this.horarioAtencionUrl, horarioAtencion, httpOptions);
    }
    eliminarHorarioAtencion(id): Observable<any> {
        let httpParams = new HttpParams();
        Object.keys(id).forEach(function (key) {
            httpParams = httpParams.append(key, id[key]);
        });
        return this.http.delete(this.horarioAtencionUrl + '/' + id);
    }
    // ----------------------------------EXCEPCIÓN-----------------------------------------------------
    getHorarioExcepcion(): Observable<any> {
        return this.http.get(this.horarioExcepcionUrl);
    }
    agregarHorarioExcepcion(horarioExcepcion: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'usuario': 'gustavo'
            })
        };
        return this.http.post(this.horarioExcepcionUrl, horarioExcepcion, httpOptions);
    }
    modificarHorarioExcepcion(horarioExcepcion: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'/*,
              'usuario': 'gustavo'*/
            })
        };
        return this.http.post(this.horarioExcepcionUrl, horarioExcepcion, httpOptions);
    }
    eliminarHorarioExcepcion(id): Observable<any> {
        let httpParams = new HttpParams();
        Object.keys(id).forEach(function (key) {
            httpParams = httpParams.append(key, id[key]);
        });
        return this.http.delete(this.horarioExcepcionUrl + '/' + id);
    }
}
