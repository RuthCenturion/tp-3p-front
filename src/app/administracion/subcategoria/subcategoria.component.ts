import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';
import { ModalComponent } from '../modal/modal.component';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare const $: any;

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})
export class SubCategoriaComponent implements OnInit {

  public tableData1: TableData;
  public dataTable: DataTable;

  idVencimiento: any;
  inicioValidez: any;
  finValidez: any;
  duracion: any;

  modificarId: any;
  modificarInicioValidez: any;
  modificarFinValidez: any;
  modificarDuracion: any;
  inicioSeleccionado: any;
  finSeleccionado: any;
  inicioModificado: any;
  finModificado: any;

  listaAtributos: Array<any>;
  listaVencimiento: Array<any>;
  lista: Array<any>;


  constructor(
    private categoriaService: CategoriaService,
    public dialog: MatDialog,
    private toast: ToastrService) {

    this.tableData1 = {
      headerRow: ['Id', 'Inicio validez', 'Fin Validez', 'Días duración', 'Acciones'],
      dataRows: this.listaVencimiento
    };
  }
  /*-------------------------------------------------------------------------*/
  listarVencimientos() {
    this.categoriaService.listarVencimientos().subscribe(
      response => {
        console.log('listarVencimientos(): ', response);
        this.listaVencimiento = new Array<any>();
        this.lista = new Array<any>();
        response.data.parametros.forEach(vencimiento => {
          this.lista.push(vencimiento);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(vencimiento.id);
          this.listaAtributos.push(vencimiento.fechaInicioValidez);
          this.listaAtributos.push(vencimiento.fechaFinValidez);
          this.listaAtributos.push(vencimiento.diasDuracion);
          this.listaVencimiento.push(this.listaAtributos);
          this.tableData1 = {
            headerRow: ['Id', 'Inicio validez', 'Fin Validez', 'Días duración', 'Acciones'],
            dataRows: this.listaVencimiento
          };
        });
      },
      error => {
        this.showNotification('Error al obtener vencimientos', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  buscar() {
    if (this.idVencimiento) {
      this.obtenerVencimiento(this.idVencimiento);
    } else {
      this.listarVencimientos();
    }
  }
  /*-------------------------------------------------------------------------*/
  obtenerVencimiento(id) {
    this.categoriaService.obtenerVencimiento(id).subscribe(
      cat => {
        this.listaVencimiento = new Array<any>();
        this.listaAtributos = new Array<any>();
        this.listaAtributos.push(cat.idCategoria);
        this.listaAtributos.push(cat.descripcion);
        this.listaVencimiento.push(this.listaAtributos);
        this.tableData1 = {
          headerRow: ['Id', 'Inicio validez', 'Fin Validez', 'Días duración', 'Acciones'],
          dataRows: this.listaVencimiento
        };
      },
      error => {
        this.showNotification('Error al obtener vencimiento', NOTIFY.DANGER);
      }
    );
  } 
  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.idVencimiento = null;
    this.inicioValidez = null;
    this.finValidez = null;
    this.duracion = null;
    this.tableData1.dataRows = [];
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    let dato = {
      fechaInicioValidez:this.fechaCadena( this.inicioValidez),
      fechaFinValidez: this.fechaCadena( this.finValidez),
      diasDuracion: this.duracion
    };
    this.categoriaService.agregarVencimiento(dato).subscribe(
      response => {
        this.showNotification('Vencimiento nuevo creado con éxito!', NOTIFY.SUCCESS);
        this.listarVencimientos();
        this.cancelarAgregar(); // limpia el modal
      },
      error => {
        this.showNotification('Error al agregar vencimiento nuevo', NOTIFY.DANGER);
        this.cancelarAgregar();
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  cancelarAgregar() {
    this.inicioValidez = null;
    this.finValidez = null;
    this.duracion = null;
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
  abrirModalModificar(id, inicio, fin, duracion) {
    let fechaInicio= new Date(inicio);
    let inicioAux = fechaInicio.setDate(fechaInicio.getDate() +1);
    let fechaFin= new Date(fin);
    let finAux = fechaFin.setDate(fechaFin.getDate() +1);
    
    this.modificarId = id;
    this.modificarInicioValidez = new Date(inicioAux);    
    this.modificarFinValidez = new Date(finAux);
    this.modificarDuracion = duracion;
    
    this.inicioSeleccionado = new Date(inicioAux);
    this.finSeleccionado = new Date(finAux);    
   
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar() {
    let dato : any;
    dato = {
      fechaInicioValidez: '',
      fechaFinValidez: '',
      diasDuracion: ''
    };
    let inicioSeleccionadoCadena = this.fechaCadena(this.inicioSeleccionado);
    let inicioNuevoCadena = this.fechaCadena(this.modificarInicioValidez);
    let finSeleccionadoCadena = this.fechaCadena(this.finSeleccionado);
    let finNuevoCadena = this.fechaCadena(this.modificarFinValidez);

    if(inicioSeleccionadoCadena === inicioNuevoCadena){
      dato.fechaInicioValidez = inicioSeleccionadoCadena;
    }else{
      dato.fechaInicioValidez= this.fechaCadena(this.modificarInicioValidez);
    }
    if(finSeleccionadoCadena === finNuevoCadena){
      dato.fechaFinValidez= finSeleccionadoCadena;
    }else {
      dato.fechaFinValidez = this.fechaCadena(this.modificarFinValidez);
    }
    dato.diasDuracion= this.modificarDuracion;
    this.categoriaService.modificarVencimiento(this.modificarId,dato).subscribe(
      response => {
        if(response.status === 0){
          this.showNotification('Vencimiento modificado con éxito!', NOTIFY.SUCCESS);
          this.listarVencimientos();
        }else {
          this.showNotification(response.message, NOTIFY.DANGER);
          this.listarVencimientos();
        }
      },
      error => {
        this.showNotification('Error al modificar vencimiento', NOTIFY.DANGER);
      // this.limpiar();
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  fechaCadena(fecha): any {
    let d = new Date(fecha);
    d = new Date(d.getTime());
    let year = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate();
    let mesCadena = '';
    let diaCadena = '';
    if (mes.toString().length == 1) {
      mesCadena = '0' + mes;
    } else {
      mesCadena = mes.toString();
    }
    if (dia.toString().length == 1) {
      diaCadena = '0' + dia;
    } else {
      diaCadena = dia.toString();
    }
    return (year.toString() +'-'+ mesCadena + '-' + diaCadena);
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.listarVencimientos();
  }

}
