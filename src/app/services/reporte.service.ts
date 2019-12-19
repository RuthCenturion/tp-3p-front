import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})



export class ReporteService {
    private urlBase = 'http://gy7228.myfoscam.org:8080/rest/';
    private urlVencimiento = this.urlBase + 'consultas/vencimientos';
    private urlBolsaPunto = this.urlBase + 'consultas/bolsaPuntos';
    private urlUsoPunto = this.urlBase + 'consultas/usoPuntos';

    constructor(private http: HttpClient) { }

    // --------------------- USO DE PUNTOS ---------------------
    // retorna los usos de puntos
    getUsoPuntoReporte(body: any): Observable<any> {
        return this.http.post(this.urlUsoPunto, body);
    }
    
    // --------------------- BOLSA DE PUNTOS ---------------------
    // retorna las bolsas de puntos
    getBolsaPuntoReporte(body: any): Observable<any> {
        return this.http.post(this.urlBolsaPunto, body);
    }
    
    // --------------------- VENCIMIENTO DE PUNTOS ---------------------
    // retorna los vencimientos
    getVencimientoReporte(body: any): Observable<any> {
        return this.http.post(this.urlVencimiento, body);
    }
}