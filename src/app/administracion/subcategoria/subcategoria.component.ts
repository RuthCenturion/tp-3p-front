import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';
import {ModalComponent} from '../modal/modal.component';

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
  idTipoProducto: any; // --> corresponde al id de la subCategoria
  idCategoria: any;
  descripcion: any;
  modificarId: any;
  modificarDescripcion: any;
  modificarCategoria: any;

  eliminarId: any;
  eliminarDescripcion: any;

  editarCategoria: true;

  animal: string;
  name: string;

  listaAtributos: Array<any>;
  listaCategoria: Array<any>;
  listaSubCategoria: Array<any>;
  lista: Array<any>;


  constructor(
    private categoriaService: CategoriaService,
    public dialog: MatDialog,
    private toast: ToastrService ) {
    this.dataTable = {
      headerRow: ['Id', 'Descripción', 'Categoría', 'Acciones'],
      footerRow: ['Id', 'Descripción', 'Categoría', 'Acciones'],
      dataRows: this.listaSubCategoria
    };
    this.tableData1 = {
      headerRow: ['Id', 'Descripción', 'Categoría', 'Acciones'],
      dataRows: this.listaSubCategoria
    };
  }

  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    this.idCategoria = null;
    this.descripcion = null;
    this.listarCategorias();
    this.listarSubCategorias();
  }

  /*-------------------------------------------------------------------------*/
 /* ngAfterViewInit() {
    $('#datatables').DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }

    });
    const table = $('#datatables').DataTable();
    // Edit record
    // EDITAR
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      let id=$tr[0].cells[0].innerText;
      let desc=$tr[0].cells[1].innerText;
      console.log('fila seleccionada: ', id, '---', desc);
      alert('You press on Row: ' + id + ' ' + desc + ' ' +  '\'s row.');
      prompt("Please enter preferred tenure in years", "15");
      this.modificarDescripcion = new String(desc);
      // this.modificarDescripcion = desc;
       $('#exampleModal2').modal('show');
       e.preventDefault();
    });

    // Delete a record
    //ELIMINAR
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });
    // Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }*/

  /*-------------------------------------------------------------------------*/
  changeDescripcion() {
    console.log('descripcion seleccionada: ', this.idCategoria);
  }

  /*-------------------------------------------------------------------------*/
  buscar() {
    if (this.idCategoria) {
      this.obtenerCategoria(this.idCategoria);
    } else {
      this.listarCategorias();
    }
  }
  /*-------------------------------------------------------------------------*/
  obtenerCategoria(id) {
    this.categoriaService.obtenerCategoria(id).subscribe(
      cat => {
        this.listaCategoria = new Array<any>();
        this.listaAtributos = new Array<any>();
        this.listaAtributos.push(cat.idCategoria);
        this.listaAtributos.push(cat.descripcion);
        this.listaCategoria.push(this.listaAtributos);
        this.dataTable = {
          headerRow: ['Id', 'Descripción', 'Acciones'],
          footerRow: ['Id', 'Descripción', 'Acciones'],
          dataRows: this.listaCategoria
        };
        this.tableData1 = {
          headerRow: ['Id', 'Descripción', 'Acciones'],
          dataRows: this.listaCategoria
        };
      },
      error => {
        this.showNotification('Error al obtener categorias', NOTIFY.DANGER);
      }
    );
  }

  /*-------------------------------------------------------------------------*/
  listarCategorias() {
  /*  this.listaCategoria = [ ['1', 'cat1'],
      ['2', 'cat2'],
      ['3', 'cat3'],
      ['4', 'cat4'],
      ['5', 'cat5'],
      ['6', 'cat6']
    ];*/

   this.categoriaService.obtenerCategoria(this.idCategoria).subscribe(
      response => {
        this.listaCategoria = new Array<any>();
        this.lista = new Array<any>();
        response.lista.forEach(cat => {
          this.lista.push(cat);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idCategoria);
          this.listaAtributos.push(cat.descripcion);
          this.listaCategoria.push(this.listaAtributos);
         /* this.dataTable = {
            headerRow: ['Id', 'Descripción', 'Acciones'],
            footerRow: ['Id', 'Descripción', 'Acciones'],
            dataRows: this.listaCategoria
          };
          this.tableData1 = {
            headerRow: ['Id', 'Descripción', 'Acciones'],
            dataRows: this.listaCategoria
          };*/
        });
      },
      error => {
        this.showNotification('Error al obtener categorias', NOTIFY.DANGER);
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  listarSubCategorias() {
    this.categoriaService.getSubCategoria().subscribe(
      response => {
        this.listaSubCategoria = new Array<any>();
        this.lista = new Array<any>();
        response.lista.forEach(cat => {
          this.lista.push(cat);
          this.listaAtributos = new Array<any>();
          this.listaAtributos.push(cat.idTipoProducto);
          this.listaAtributos.push(cat.descripcion);
          this.listaAtributos.push(cat.idCategoria.descripcion);
          this.listaAtributos.push(cat.idCategoria.idCategoria);
          this.listaSubCategoria.push(this.listaAtributos);
         /* this.dataTable = {
            headerRow: ['Id', 'Descripción', 'Acciones'],
            footerRow: ['Id', 'Descripción', 'Acciones'],
            dataRows: this.listaCategoria
          };*/
          this.tableData1 = {
            headerRow: ['Id', 'Descripción', 'Categoría', 'idCategoria', 'Acciones'],
            dataRows: this.listaSubCategoria
          };
        });
      },
      error => {
        this.showNotification('Error al obtener categorias', NOTIFY.DANGER);
      }
    );
   /* this.tableData1 = {
      headerRow: ['Id', 'Descripción', 'Categoría', 'Id Categoria', 'Acciones'],
      dataRows: this.listaSubCategoria
    };*/
  }
  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.idCategoria = null;
    this.tableData1.dataRows = [];
  }

  /*-------------------------------------------------------------------------*/
 agregar() {
   let dato = {
     descripcion: this.descripcion,
     idCategoria: {
       idCategoria: this.idCategoria
     }
   };
   console.log('subCategoria a agregar: ', dato);
   this.categoriaService.agregarSubCategoria(dato).subscribe(
     response => {
       console.log('lo creado: ', response);
       this.showNotification('Categoría creada con éxito!', NOTIFY.SUCCESS);
       this.listarSubCategorias();
       this.descripcion = null;
       this.idCategoria = null;
     },
     error => {
      this.showNotification('Error al agregar SubCategoría', NOTIFY.DANGER);
      this.descripcion = null;
       this.idCategoria = null;
    }
   );
 }
 cancelarAgregar() {
   this.descripcion = null;
   this.idCategoria = null;
 }
  /*-------------------------------------------------------------------------*/
  showNotification( mensaje: any, color: any) {
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
 /* openDialog() {
    console.log('name: ', this.modificarDescripcion);
   // this.dialog = new MatDialog();
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: {name: this.modificarDescripcion, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }*/
  /*-------------------------------------------------------------------------*/
  abrirModalModificar(id, desc, cat, idCat) {
    console.log('fila seleccionada: ', id, ' ', desc, ' ', cat, ' ', idCat);
    this.modificarId = id;
    this.modificarDescripcion = desc;
    //this.modificarCategoria = idCat;
    this.modificarCategoria = idCat;
    $('#exampleModal2').modal('show');
  }
  /*-------------------------------------------------------------------------*/
  modificar() {
    console.log('fila datos a modificar: ', this.modificarId, ' ', this.modificarDescripcion, ' ', this.modificarCategoria );
    // llamar al service
    this.showNotification('FALTA IMPLEMENTAR LLAMADO AL BACK ', NOTIFY.WARNING);
    console.log('datos a modificar: ');
    console.log('modificarCategoria: ', this.modificarCategoria);
    console.log('modificarDescripcion: ', this.modificarDescripcion);
    let dato = {
      idTipoProducto: this.modificarId,
      descripcion: this.modificarDescripcion,
      idCategoria: {
        idCategoria: this.modificarCategoria
      }
    };
    console.log('dato: ', dato);
    this.categoriaService.modificarSubCategoria(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Categoría creada con éxito!', NOTIFY.SUCCESS);
        this.listarSubCategorias();
        this.descripcion = null;
        this.idCategoria = null;
      },
      error => {
       this.showNotification('Error al agregar SubCategoría', NOTIFY.DANGER);
       this.descripcion = null;
        this.idCategoria = null;
     }
    );
    //this.showNotification('Los datos se han modificado con éxito. ', NOTIFY.SUCCESS);
  }
  confirmarEliminar(id, desc) {
    $('#exampleModal3').modal('show');
    this.eliminarId = id;
    this.eliminarDescripcion = desc;
  }
  eliminar() {
    //  this.showNotification('FALTA IMPLEMENTAR LLAMADO AL BACK ', NOTIFY.WARNING);
    this.categoriaService.eliminarSubCategoria(this.eliminarId).subscribe(
      response => {
        this.showNotification('Sub-Categoría eliminada con éxito!', NOTIFY.SUCCESS);
        this.listarSubCategorias();
      },
      error => {
        this.showNotification('Error al eliminar SubCategoría', NOTIFY.DANGER);
      }
    );
  }

}
