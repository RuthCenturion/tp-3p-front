import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';
import { ModalComponent } from '../modal/modal.component';
import { PageEvent } from '@angular/material';

declare const $: any;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  public tableData1: TableData;

  montoEquivalencia: any;
  limiteInferior: any;
  limiteSuperior: any;

  idCategoria: any;
  descripcion: any;
  modificarInferior: any;
  modificarSuperior: any;
  modificarEquivalencia: any;
  modificarId: any;
  /*modificarDescripcion: any;*/

  listaAtributos: Array<any>;
  listaCategoria: Array<any>;
  lista: Array<any>;

  // MatPaginator Inputs
  length;
  pageSize = 5;

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private categoriaService: CategoriaService,
    public dialog: MatDialog,
    private toast: ToastrService) {
 
    this.tableData1 = {
      headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
      dataRows: this.listaCategoria
    };
  }

  /*-------------------------------------------------------------------------*/
  listarReglas(){
    this.categoriaService.listarReglas().subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        this.lista = new Array<any>();
        this.length = response.totalDatos;
        response.data.reglas.forEach(regla => {
          this.lista.push(regla);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(regla.id);
          this.listaAtributos.push(regla.limiteInferior);
          this.listaAtributos.push(regla.limiteSuperior);
          this.listaAtributos.push(regla.montoEquivalencia);
          this.listaCategoria.push(this.listaAtributos);
          this.tableData1 = {
            headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
            dataRows: this.listaCategoria
          };
        });
      },
      error => {
        this.showNotification('Error al obtener reglas', NOTIFY.DANGER);
      }
    );

  }
  /*-------------------------------------------------------------------------*/
  buscar() {
    if (this.descripcion) { //  if (this.idCategoria) {
      this.obtenerCategoria(this.descripcion);
    } else {
      this.listarCategorias();
    }
    // this.descripcion= "hola";
  }
  /*-------------------------------------------------------------------------*/
  obtenerCategoria(descripcion) {
    let filtroLike = '?like=S&ejemplo=%7B%22descripcion%22%3A%22' + descripcion + '%22%7D';
    this.categoriaService.obtenerCategoria(filtroLike).subscribe(
      response => {
        if (response.lista.length > 0) {
          this.listaCategoria = new Array<any>();
          this.lista = new Array<any>();
          response.lista.forEach(cat => {
            this.lista.push(cat);
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cat.idCategoria);
            this.listaAtributos.push(cat.descripcion);
            this.listaCategoria.push(this.listaAtributos);
            
            this.tableData1 = {
              headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
              dataRows: this.listaCategoria
            };
          });
        } else {
          this.listaCategoria = [];
          this.tableData1 = {
            headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
            dataRows: this.listaCategoria
          };
        }
      },
      error => {
        // this.showNotification('Error al obtener categorias' + error, NOTIFY.DANGER);
        this.listaCategoria = [];
        this.tableData1 = {
          headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
          dataRows: this.listaCategoria
        };
      }
    );
  }

  /*-------------------------------------------------------------------------*/
  //listaCategorias categorias w
  listarCategorias() {
    /* this.listaCategoria=[['1','2'],['a','b'],['1','2']];
     this.tableData1 = {
       headerRow: ['Id', 'Descripción', 'Acciones'],
       dataRows: this.listaCategoria
     };*/
    this.categoriaService.obtenerCategoria(this.idCategoria).subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        this.lista = new Array<any>();
        this.length = response.totalDatos;
        response.lista.forEach(cat => {
          this.lista.push(cat);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idCategoria);
          this.listaAtributos.push(cat.descripcion);
          this.listaCategoria.push(this.listaAtributos);
          this.length = this.listaCategoria.length;
          this.tableData1 = {
            headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
            dataRows: this.listaCategoria
          };
        });
      },
      error => {
        this.showNotification('Error al obtener reglas', NOTIFY.DANGER);
      }
    );
  }

  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.tableData1.dataRows = [];
  }
  /*-------------------------------------------------------------------------*/
  limpiarAgregar() {
    this.limiteInferior = null;
    this.limiteSuperior = null;
    this.montoEquivalencia = null;
  }
  limpiarModificar(){
    this.modificarInferior = null;
    this.modificarSuperior = null;
    this.modificarEquivalencia = null;
  }

  /*-------------------------------------------------------------------------*/
  agregar() {
    let dato = {
      limiteInferior: this.limiteInferior,
      limiteSuperior: this.limiteSuperior,
      montoEquivalencia: this.montoEquivalencia
    };
    this.categoriaService.agregarRegla(dato).subscribe(
      response => {
        this.showNotification('Regla nueva creada con éxito!', NOTIFY.SUCCESS);
        this.listarReglas();
        this.limpiarAgregar();
      },error => {
        this.showNotification('Error al crear regla de asignación nueva', NOTIFY.DANGER);
        this.limpiarAgregar();
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  showNotification(mensaje: any, color: any) {
    const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    $.notify({
      icon: 'notifications',
      message: mensaje
    }, {
        type: type[color],
        timer: 3000,
        placement: {
          from: 'top',
          align: 'right'
        },
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          // tslint:disable-next-line: max-line-length
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          // tslint:disable-next-line: max-line-length
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(id, inferior, superior, equivalencia) {
    console.log('fila seleccionada: ', id, ' ',  inferior,' ',  superior, ' ', equivalencia);
    this.modificarId = id;
    this.modificarInferior = inferior;
    this.modificarSuperior = superior;
    this.modificarEquivalencia = equivalencia;
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar() {
    let dato = {
      limiteInferior: this.modificarInferior,
      limiteSuperior: this.modificarSuperior,
      montoEquivalencia: this.modificarEquivalencia
    };
    this.categoriaService.modificarRegla(this.modificarId,dato).subscribe(
      response => {
        this.showNotification('Regla modificada con éxito!', NOTIFY.SUCCESS);
        this.listarReglas();
        this.limpiarModificar();
      },error => {
        this.showNotification('Error al modificar regla de asignación.', NOTIFY.DANGER);
        this.limpiarModificar();
      }
    );
  }
 
  /*-------------------------------------------------------------------------*/
  //listaCategorias paginado
  listarCategoriasPaginado(evento: any) {
    let inicio;
    if(evento == undefined) {
      inicio = 0
    } else {
      inicio  = evento.pageIndex * this.pageSize;
    }
    this.categoriaService.obtenerCategoriaPaginado(this.descripcion, inicio, this.pageSize).subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        this.lista = new Array<any>();
        this.length = response.totalDatos;
        response.lista.forEach(cat => {
          this.lista.push(cat);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idCategoria);
          this.listaAtributos.push(cat.descripcion);
          this.listaCategoria.push(this.listaAtributos);
          this.tableData1 = {
            headerRow: ['Id', 'Límite Inferior','Límite Inferior', 'Monto equivalencia', 'Acciones'],
            dataRows: this.listaCategoria
          };
        });
      },
      error => {
        this.showNotification('Error al obtener reglas', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
 //   this.listarCategoriasPaginado(undefined);
    this.listarReglas();
  }
}
