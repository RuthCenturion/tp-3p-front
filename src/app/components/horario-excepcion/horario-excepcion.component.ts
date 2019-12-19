import { Component, OnInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { PageEvent } from '@angular/material';

import { NOTIFY } from '../../commons/app-utils';
import { HorarioService } from '../../services/horario.service';

declare const $: any;

@Component({
  selector: 'app-horario-excepcion',
  templateUrl: './horario-excepcion.component.html',
  styleUrls: ['./horario-excepcion.component.css']
})
export class HorarioExcepcionComponent implements OnInit {

  public tableData1: TableData;
  public tableBuscarCliente: TableData;
  public tableBuscarConcepto: TableData;
  

  idHorarioExcepcion: any;
  idEmpleado: any;
  nombreEmpleado: any;
  fecha: any;
  horaApertura: any;
  horaCierre: any;
  flagEsHabilitar: any;
  intervalo: any;
  buscarClienteNombre: any;
  buscarConceptoNombre: any;
  clienteId: any;
  clienteNombre: any;
  conceptoId : any;
 conceptoNombre: any;

  mostrarHoras: any;

  aperturaSeleccionada: any;
  cierreSeleccionado: any;
  modificarIdHorarioExcepcion: any;
  modificarIdEmpleado: any;
  modificarNombreEmpleado: any;
  modificarFecha: any;
  modificarHoraApertura: any;
  modificarHoraCierre: any;
  modificarFlagEsHabilitar: any;
  modificarIntervalo: any;

  eliminarId: any;

   // MatPaginator Inputs
 length;
 pageSize = 5;
 lengthBuscadorCliente;
 // MatPaginator Output
 pageEvent: PageEvent;

 lengthBuscadorConcepto; 

  listaAtributos: Array<any>;
  listaEmpleados: Array<any>;
  listaHorarios: Array<any>;
  listaBuscarClientes: Array<any>;
  listaBuscarConcepto: Array<any>;
  listaClienteSeleccionados: Array<any>;
  listaNombreClienteSeleccionados: Array<any>;
  listaConceptosSeleccionados: Array<any>;
  listaNombreConceptosSeleccionados: Array<any>;

  constructor(private service: HorarioService, ) {
    this.tableData1 = {
      headerRow: ['Id', 'Id Esp.', 'Especialista', 'Fecha', 'Apertura', 'Cierre', 'Habilitado', 'Intervalo', 'Acciones'],
      dataRows: this.listaHorarios
    };
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre','Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    this.tableBuscarConcepto = {
      headerRow: ['Id', 'Descripcion','Cantidad'],
      dataRows: this.listaBuscarConcepto
    };
  }

  /*-------------------------------------------------------------------------*/
  agregar() { 
    
    let datos = {
      clienteId: this.clienteId,
      conceptoId: this.conceptoId      
    };
    let mensaje = '';
    this.service.agregarUsoPuntosBolsa(datos).subscribe(
      response => {
        if(response.status === 0){
          this.showNotification(response.message, NOTIFY.SUCCESS);
          this.limpiar();
        } else {
          if((typeof this.clienteId === 'undefined' || typeof this.clienteId === null) 
          && (typeof this.conceptoId === 'undefined' || typeof this.conceptoId === null))  {            
              mensaje = 'No existen los datos ingresados. No se puede agregar. ';
          }
          if((typeof this.clienteId === 'undefined' || typeof this.clienteId === null || typeof this.clienteId === undefined) 
          && typeof this.conceptoId !== 'undefined'  
          && typeof this.conceptoId !== null)  {         
            mensaje = 'No existe cliente '+this.clienteNombre+'. No se puede agregar';
          }
          if((typeof this.conceptoId === 'undefined' || typeof this.conceptoId === null || typeof this.conceptoId === undefined )
          &&  typeof this.clienteId !== 'undefined'  
          &&  typeof this.clienteId !== null  )  { 
            mensaje = 'No existe concepto '+this.conceptoNombre+'. No se puede agregar. ';
          }  
          if(mensaje === '')  {
            this.showNotification(response.message, NOTIFY.DANGER);
          } else {
            this.showNotification(mensaje, NOTIFY.DANGER);
          }
         
          this.limpiar();
        }
      },
      error => {
        this.showNotification('Error al agregar un uso!', NOTIFY.DANGER);
      }
    );
  }
  
  /*-------------------------------------------------------------------------*/
  listarClientePaginado(evento, buscarClienteNombre) {
    // getClienteBuscador  --- de servicio
    // getClienteBuscadorPaginado --- de servicio
    let filtros = '';
    if (buscarClienteNombre !== undefined && buscarClienteNombre !== null) {
      filtros = '?parametro=' + buscarClienteNombre;
    }
    this.service.getClienteBuscador(filtros).subscribe(
      response => {
        this.listaHorarios = new Array<any>();
        if (response.data.clientes.length > 0) {
          response.data.clientes.forEach(cliente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.id); // 0
            this.listaAtributos.push(cliente.nombre +' '+cliente.apellido); // 1
            this.listaAtributos.push(cliente.nroDocumento); // 2
            this.listaAtributos.push(cliente.email); // 3
            this.listaHorarios.push(this.listaAtributos);
            this.tableBuscarCliente = {
              headerRow: ['Id', 'Nombre','Nro. Documento', 'Email'],
              dataRows: this.listaHorarios
            };
          });
        }
      });

  }
  /*-------------------------------------------------------------------------*/
  seleccionarVariosCliente(clienteSeleccionado){
    // clienteSeleccionado 0 == id
    // clienteSeleccionado 1 == nombre
    // clienteSeleccionado 2 == numero documento
    // clienteSeleccionado 3 == email
    // si no hay elementos en la lista --> agregar
    if (this.listaClienteSeleccionados.length === 0) {
      this.listaClienteSeleccionados.push(clienteSeleccionado[0]);
      this.listaNombreClienteSeleccionados.push(clienteSeleccionado[1]);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaClienteSeleccionados.includes(clienteSeleccionado[0])) {
        let posicion = this.listaClienteSeleccionados.indexOf(clienteSeleccionado[0]);
        // se elimina de la lista
        this.listaClienteSeleccionados.splice(posicion, 1);
        this.listaNombreClienteSeleccionados.splice(posicion, 1);
      } else {
        this.listaClienteSeleccionados.push(clienteSeleccionado[0]);
        this.listaNombreClienteSeleccionados.push(clienteSeleccionado[1]);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
  }
  /*-------------------------------------------------------------------------*/
  aceptarCliente() {
    // obtener el cliente con el unico id que esta en la lista 'listaSeleccionados'
    this.clienteId = this.listaClienteSeleccionados[0];
    this.clienteNombre = this.listaNombreClienteSeleccionados[0];
    this.buscarClienteNombre = null;
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre','Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
    $('#exampleModal3').modal('hide');
    // se elimina lo seleccionado
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.lengthBuscadorCliente = 0;
  }
   /*-------------------------------------------------------------------------*/
   cancelarBuscarCliente() {
    this.buscarClienteNombre = null;
    this.lengthBuscadorCliente = 0;
    this.listaClienteSeleccionados = [];
    this.listaNombreClienteSeleccionados = [];
    this.listaBuscarClientes = [];
    this.tableBuscarCliente = {
      headerRow: ['Id', 'Nombre','Nro. Documento', 'Email'],
      dataRows: this.listaBuscarClientes
    };
  }
   
  /*-------------------------------------------------------------------------*/
  listarConceptoPaginado(evento, buscarConceptoNombre) {
    // getClienteBuscador  --- de servicio
    // getClienteBuscadorPaginado --- de servicio
    let filtros = '';
    if (buscarConceptoNombre !== undefined && buscarConceptoNombre !== null) {
      filtros = '?parametro=' + buscarConceptoNombre;
    }
    this.service.getConceptoBuscador(filtros).subscribe(
      response => {
        this.listaHorarios = new Array<any>();
        if (response.data.vales.length > 0) {
          response.data.vales.forEach(cliente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(cliente.id); // 0
            this.listaAtributos.push(cliente.descripcion); // 1
            this.listaAtributos.push(cliente.cantidadRequerida); // 2
            this.listaHorarios.push(this.listaAtributos);

            this.tableBuscarConcepto = {
              headerRow: ['Id', 'Descripción','Cantidad'],
              dataRows: this.listaHorarios
            };
          });
        }
      });
  }
  /*-------------------------------------------------------------------------*/
  seleccionarVariosConceptos(conceptoSeleccionado){
    // clienteSeleccionado 0 == id
    // clienteSeleccionado 1 == descripcion
    // clienteSeleccionado 2 == cantidadRequerida

    // si no hay elementos en la lista --> agregar
    if (this.listaConceptosSeleccionados.length === 0) {
      this.listaConceptosSeleccionados.push(conceptoSeleccionado[0]);
      this.listaNombreConceptosSeleccionados.push(conceptoSeleccionado[1]);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaConceptosSeleccionados.includes(conceptoSeleccionado[0])) {
        let posicion = this.listaConceptosSeleccionados.indexOf(conceptoSeleccionado[0]);
        // se elimina de la lista
        this.listaConceptosSeleccionados.splice(posicion, 1);
        this.listaNombreConceptosSeleccionados.splice(posicion, 1);
      } else {
        this.listaConceptosSeleccionados.push(conceptoSeleccionado[0]);
        this.listaNombreConceptosSeleccionados.push(conceptoSeleccionado[1]);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
  }
  /*-------------------------------------------------------------------------*/
  aceptarConcepto() {
    // obtener el cliente con el unico id que esta en la lista 'listaSeleccionados'
    this.conceptoId = this.listaConceptosSeleccionados[0];
    this.conceptoNombre = this.listaNombreConceptosSeleccionados[0];
    this.buscarConceptoNombre = null;
    this.listaBuscarConcepto = [];
    this.tableBuscarConcepto = {
      headerRow: ['Id', 'Descripción','Cantidad', ],
      dataRows: this.listaBuscarConcepto
    };
    $('#exampleModal4').modal('hide');
    // se elimina lo seleccionado
    this.listaConceptosSeleccionados = [];
    this.listaNombreConceptosSeleccionados = [];
    this.lengthBuscadorConcepto = 0;
  }
   /*-------------------------------------------------------------------------*/
   cancelarBuscarConcepto() {
    this.buscarConceptoNombre = null;
    this.lengthBuscadorConcepto = 0;
    this.listaConceptosSeleccionados = [];
    this.listaNombreConceptosSeleccionados = [];
    this.listaBuscarConcepto = [];
    this.tableBuscarConcepto = {
      headerRow: ['Id', 'Descripción','Cantidad'],
      dataRows: this.listaBuscarConcepto
    };
  }
   
  /*-------------------------------------------------------------------------*/
  limpiar() {
    this.conceptoId = null;
    this.clienteId = null;
    this.conceptoNombre = null;
    this.clienteNombre = null;
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
  ngOnInit() {
    this.listaBuscarClientes = new Array<any>();
    this.listaClienteSeleccionados = new Array<any>();
    this.listaConceptosSeleccionados = new Array<any>();
    this.listaNombreClienteSeleccionados = new Array<any>();
    this.listaNombreConceptosSeleccionados = new Array<any>();        
  }

}
