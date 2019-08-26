import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SERVICE_REST,API_HOST } from '../commons/app-utils';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'; 
@Injectable({
  providedIn: 'root'
})


export class CategoriaService {
  private urlBase = 'https://gy7228.myfoscam.org:8443/stock-pwfe/';
  private categoriaUrl = SERVICE_REST + 'categoria';

  constructor(private http: HttpClient) { }

  getCategoria(): Observable<any> {
    return this.http.get(this.categoriaUrl);
  }

  obtenerCategoria(idCategoria): Observable<any> {
    if (idCategoria) {
      return this.http.get(this.categoriaUrl + '/' + idCategoria);
    } else {
      return this.http.get(this.categoriaUrl);
    }
  }

  agregarCategoria(categoria: any): Observable<any> {
    return this.http.post(this.categoriaUrl, categoria/*, httpOptions*/);
  }
}
