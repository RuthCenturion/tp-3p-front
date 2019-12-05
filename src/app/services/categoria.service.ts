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
  private urlBase = 'http://gy7228.myfoscam.org:8080/rest/';
  private categoriaUrl = SERVICE_REST + 'categoria';
  private subCategoriaUrl = SERVICE_REST + 'tipoProducto';
  private servicioUrl = SERVICE_REST + 'presentacionProducto';
  private productoUrl = SERVICE_REST + 'producto';
  private pacienteUrl = SERVICE_REST + 'clientes';
  private clienteUrl = this.urlBase + 'clientes';
  
  
  

  constructor(private http: HttpClient) { }
  // --------------------- CATEGORIAS ---------------------
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

  obtenerCategoriaPaginado(descripcion: any, inicio: number, cantidad:number): Observable<any>{
    if (descripcion) {
      return this.http.get(this.categoriaUrl  + descripcion);
    } else {
      return this.http.get(this.categoriaUrl + '?orderBy=idCategoria&orderDir=asc&inicio='+inicio+'&cantidad='+cantidad);
    }
  }

  agregarCategoria(categoria: any): Observable<any> {
    return this.http.post(this.categoriaUrl, categoria/*, httpOptions*/);
  }
  eliminarCategoria(id): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(id).forEach( function(key) {
      httpParams = httpParams.append(key, id[key]);
    });
    return this.http.delete(this.categoriaUrl + '/' + id);
  }
  // --------------------- SUB-CATEGORIAS ---------------------
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
// --------------------- SERVICIOS ---------------------
  getServicios(): Observable<any> {
    return this.http.get(this.servicioUrl);
  }
  listarProductos(): Observable<any> {
    return this.http.get(this.productoUrl);
  }
  agregarServicio(servicio: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.servicioUrl, servicio, httpOptions);
  }
  eliminarServicio(id): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(id).forEach( function(key) {
      httpParams = httpParams.append(key, id[key]);
    });
    return this.http.delete(this.servicioUrl + '/' + id);
  }
  // --------------------- CLIENTES ---------------------
  listarClientes(): Observable<any> {
    return this.http.get(this.clienteUrl+'/all');
  }
  agregarCliente(cliente: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.clienteUrl+'/add', cliente, httpOptions);
  }
  buscarClientes(param:any, filtro:any):Observable<any>{
    return this.http.post(this.clienteUrl+'/getByPage'+filtro, param);
  }
  modificarPaciente(paciente: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.pacienteUrl, paciente, httpOptions);
  }
  eliminarPaciente(id): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(id).forEach( function(key) {
      httpParams = httpParams.append(key, id[key]);
    });
    return this.http.delete(this.pacienteUrl + '/' + id);
  }
}
