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
  private subCategoriaUrl = SERVICE_REST + 'tipoProducto';
  
  

  constructor(private http: HttpClient) { }

  getCategoria(): Observable<any> {
    return this.http.get(this.categoriaUrl);
  }

  obtenerCategoria(descripion): Observable<any> {
    if (descripion) {
      return this.http.get(this.categoriaUrl  + descripion);
    } else {
      return this.http.get(this.categoriaUrl);
    }
  }

  agregarCategoria(categoria: any): Observable<any> {
    return this.http.post(this.categoriaUrl, categoria/*, httpOptions*/);
  }
  getSubCategoria(): Observable<any> {
    return this.http.get(this.subCategoriaUrl);
  }
  obtenerSubCategoria(descripion): Observable<any> {
    if (descripion) {
      return this.http.get(this.subCategoriaUrl  + descripion);
    } else {
      return this.http.get(this.subCategoriaUrl);
    }
  }
  agregarSubCategoria(subCategoria: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.subCategoriaUrl, subCategoria, httpOptions);
  }
  modificarSubCategoria(subCategoria: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.subCategoriaUrl, subCategoria, httpOptions);
  }
  eliminarSubCategoria(id): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(id).forEach( function(key) {
      httpParams = httpParams.append(key, id[key]);
    });
    return this.http.delete(this.subCategoriaUrl + '/' + id);
  }
}
