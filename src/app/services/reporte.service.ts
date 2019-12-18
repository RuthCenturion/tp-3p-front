import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})



export class ReporteService {
    private urlBase = 'http://gy7228.myfoscam.org:8080/rest/';
    private urlVencimiento = this.urlBase + 'consultas/vencimientos';

    constructor(private http: HttpClient) { }

    // --------------------- VENCIMIENTO DE PUNTOS ---------------------
    // retorna los vencimientos
    getVencimientoReporte(body: any): Observable<any> {
        console.log('body service ', body)
        return this.http.post(this.urlVencimiento, body);
    }
}