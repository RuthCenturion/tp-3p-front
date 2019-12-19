import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ReporteService } from 'src/app/services/reporte.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { NOTIFY } from '../../commons/app-utils';
import * as jsPDF from 'jspdf';
import { HorarioService } from 'src/app/services/horario.service';

@Component({
  selector: 'app-bolsa-punto-reporte',
  templateUrl: './bolsa-punto-reporte.component.html',
  styleUrls: ['./bolsa-punto-reporte.component.css']
})
export class BolsaPuntoReporteComponent implements OnInit {

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  public tableData1: TableData;
  public tableBuscarCliente: TableData;

  listaAtributos: Array<any>;
  listaBolsaPunto: Array<any>;
  lista: Array<any>;

  clienteId: any;
  mostrarFiltro: any;
  buscarClienteNombre: any;
  clienteNombre: any;
  lengthBuscadorCliente;

  listaHorarios: Array<any>;
  listaBuscarClientes: Array<any>;
  listaClienteSeleccionados: Array<any>;
  listaNombreClienteSeleccionados: Array<any>;

  /*name of the excel-file which will be downloaded. */
  fileName = 'bolsa-punto-reporte.xlsx';

  constructor(private reporteService: ReporteService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private service: HorarioService) { }

  iniciarTabla() {
    this.tableData1 = {
      headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
        'Puntaje Utilizado', 'Saldo', 'Monto'],
      dataRows: this.listaBolsaPunto
    };

    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }

  getBolsaPuntos(clienteId) {
    let body;
    if (clienteId == undefined || clienteId == null) {
      body = {};
      this.clienteNombre = null;
    } else {
      body = {
        "clienteId": clienteId
      }
    }
    this.reporteService.getBolsaPuntoReporte(body).subscribe(
      response => {
        this.listaBolsaPunto = new Array<any>();
        this.lista = new Array<any>();
        if (response.data.bolsaPuntos.length > 0) {
          response.data.bolsaPuntos.forEach(bolsaPuntos => {
            this.lista.push(bolsaPuntos);
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(bolsaPuntos.cliente.nombre);
            this.listaAtributos.push(bolsaPuntos.cliente.apellido);
            this.listaAtributos.push(bolsaPuntos.fechaAsignacion);
            this.listaAtributos.push(bolsaPuntos.fechaCaducidad);
            this.listaAtributos.push(bolsaPuntos.puntajeAsignado);
            this.listaAtributos.push(bolsaPuntos.puntajeUtilizado);
            this.listaAtributos.push(bolsaPuntos.saldo);
            this.listaAtributos.push(bolsaPuntos.monto);
            this.listaBolsaPunto.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
                'Puntaje Utilizado', 'Saldo', 'Monto'],
              dataRows: this.listaBolsaPunto
            };
          });
        } else {
          this.showNotification(response.message, NOTIFY.WARNING);
          this.limpiar();
        }

      },
      error => {
        this.limpiar();
        this.showNotification('Error al obtener vencimientos', NOTIFY.DANGER);
      }
    );
  }

  limpiar() {
    this.listaBolsaPunto = [];
    this.tableData1 = {
      headerRow: ['Nombre', 'Apellido', 'Fecha Asignacion', 'Fecha Caducidad', 'Puntaje Asignado',
        'Puntaje Utilizado', 'Saldo', 'Monto'],
      dataRows: this.listaBolsaPunto
    };
    this.clienteNombre = null;
    this.clienteId = null;
  }

  /*-------------------------------------------------------------------------*/
  toggleFiltro() {
    if (this.mostrarFiltro) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  exportarExcel() {
    /* table id is passed over here */
    let element = document.getElementById('export-excel');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  exportarPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdfTable.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('bolsa-punto-reporte.pdf');
  }

  listarClientePaginado(evento, buscarClienteNombre) {

    let filtros = '';
    if (buscarClienteNombre !== undefined && buscarClienteNombre !== null) {
      filtros = '?parametro=' + buscarClienteNombre;
    }
    this.service.getClienteBuscador(filtros).subscribe(
      response => {
        console.log('listarCliente en buscador(): ', response);
        this.listaHorarios = new Array<any>();
        console.log('lista de horarios de atencion: ', response);
        if (response.data.clientes.length > 0) {
          response.data.clientes.forEach(cliente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.id); // 0
            this.listaAtributos.push(cliente.nombre + ' ' + cliente.apellido); // 1
            this.listaAtributos.push(cliente.nroDocumento); // 2
            this.listaAtributos.push(cliente.email); // 3
            this.listaHorarios.push(this.listaAtributos);

            this.tableBuscarCliente = {
              headerRow: ['Id', 'Nombre', 'Nro. Documento', 'Email'],
              dataRows: this.listaHorarios
            };
          });
        }

      });
  }

  seleccionarVariosCliente(clienteSeleccionado) {
    // clienteSeleccionado 0 == id
    // clienteSeleccionado 1 == nombre
    // clienteSeleccionado 2 == numero documento
    // clienteSeleccionado 3 == email
    console.log('cliente seleccionado: ', clienteSeleccionado);
    //  console.log('idSeleccionado: ', idSeleccionado);
    console.log('lista de id seleccionados: ', this.listaClienteSeleccionados);

    // si no hay elementos en la lista --> agregar
    if (this.listaClienteSeleccionados.length === 0) {
      this.listaClienteSeleccionados.push(clienteSeleccionado[0]);
      this.listaNombreClienteSeleccionados.push(clienteSeleccionado[1]);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaClienteSeleccionados.includes(clienteSeleccionado[0])) {
        let posicion = this.listaClienteSeleccionados.indexOf(clienteSeleccionado[0]);
        console.log('se encuentra en la posicion: ', this.listaClienteSeleccionados.indexOf(clienteSeleccionado[0]));
        // se elimina de la lista
        this.listaClienteSeleccionados.splice(posicion, 1);
        this.listaNombreClienteSeleccionados.splice(posicion, 1);
      } else {
        this.listaClienteSeleccionados.push(clienteSeleccionado[0]);
        this.listaNombreClienteSeleccionados.push(clienteSeleccionado[1]);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
    console.log('lista de id seleccionados al final: ', this.listaClienteSeleccionados);
  }

  aceptarCliente() {
    // obtener el cliente con el unico id que esta en la lista 'listaSeleccionados'
    this.clienteId = this.listaClienteSeleccionados[0];

    this.getBolsaPuntos(this.clienteId);

    this.clienteNombre = this.listaNombreClienteSeleccionados[0];
    // limpiar la grilla del buscadorEmpleado
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    $('#exampleModal3').modal('hide');
    // se elimina lo seleccionado
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.lengthBuscadorCliente = 0;
  }

  cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    // this.fila = null;
    this.lengthBuscadorCliente = 0;
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre', 'Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }

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

  ngOnInit() {
    this.listaBuscarClientes = new Array<any>();
    this.listaClienteSeleccionados = new Array<any>();
    this.listaNombreClienteSeleccionados = new Array<any>();
    this.mostrarFiltro = false;
    this.iniciarTabla();
    this.getBolsaPuntos(null);
  }

}
