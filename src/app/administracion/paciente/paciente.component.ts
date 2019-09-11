import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { TableData } from '../../md/md-table/md-table.component';
import { CategoriaService } from '../../services/categoria.service';
import { NOTIFY } from '../../commons/app-utils';


declare const $: any;

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  nombre: any;
  apellido: any;
  email: any;
  telefono: any;
  ruc: any;
  cedula: any;
  tipoPersona: any;
  fechaNacimiento: any;

  public tableData1: TableData;
  listaAtributos: Array<any>;
  listaPacientes: Array<any>;

  constructor(private service: CategoriaService) {
    this.tableData1 = {
      headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Email', 'Teléfono', 'Acciones'],
      dataRows: this.listaPacientes
    };
  }

  listarPacientes() {
    this.service.listarPacientes().subscribe(
      response => {
        console.log('lista de pacientes: ', response);
        this.listaPacientes = new Array<any>();
        if (response.totalDatos > 0) {
          response.lista.forEach(paciente => {
            this.listaAtributos = new Array<any>();
            this.listaAtributos.push(paciente.idPersona); // 0
            this.listaAtributos.push(paciente.nombre); // 1
            this.listaAtributos.push(paciente.apellido); // 2
            this.listaAtributos.push(paciente.cedula); // 3
            this.listaAtributos.push(paciente.email); // 4
            this.listaAtributos.push(paciente.telefono); // 5
            this.listaPacientes.push(this.listaAtributos);
            this.tableData1 = {
              headerRow: ['Id', 'Nombre', 'Apellido', 'Nº Documento', 'Email', 'Teléfono', 'Acciones'],
              dataRows: this.listaPacientes
            };
          });
        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  agregar() {
    let d = new Date(this.fechaNacimiento);
    d = new Date(d.getTime() - 3000000);
    // tslint:disable-next-line: max-line-length
  /*  let date_format_str = d.getFullYear().toString() + '-' 
      + ((d.getMonth() + 1).toString().length === 2 ? (d.getMonth() + 1).toString() : '0' 
      + (d.getMonth() + 1).toString()) + '-' 
      + (d.getDate().toString().length === 2 ? d.getDate().toString() : '0' + d.getDate().toString()) + ' ' 
      + (d.getHours().toString().length === 2 ? d.getHours().toString() : '0' + d.getHours().toString()) + ':' 
      + ((parseInt(d.getMinutes()/5)*5).toString().length === 2 ? (parseInt(d.getMinutes()/5)*5).toString() : '0' 
      + (parseInt(d.getMinutes()/5)*5).toString()) + ':00';*/


      let year= d.getFullYear();
      let mes = d.getMonth() + 1;
      let dia = d.getDate() + 1;
      let fechaString = year + '-' + mes + '-' + dia + ' 00:00:00';
    console.log('********',fechaString );
  
    let dato = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      ruc: this.ruc,
      cedula: this.cedula,
      tipoPersona: 'FISICA',
      fechaNacimiento: fechaString
    };
    console.log('paciente a agregar: ', dato);
    this.service.agregarPaciente(dato).subscribe(
      response => {
        console.log('lo creado: ', response);
        this.showNotification('Paciente creado con éxito!', NOTIFY.SUCCESS);
        this.listarPacientes();
        this.nombre = null;
        this.apellido = null;
        this.email = null;
        this.telefono = null;
        this.ruc = null;
        this.cedula = null;
        this.fechaNacimiento = null;
      },
      error => {
        this.showNotification('Error al agregar paciente', NOTIFY.DANGER);
        this.nombre = null;
        this.apellido = null;
        this.email = null;
        this.telefono = null;
        this.ruc = null;
        this.cedula = null;
        this.fechaNacimiento = null;
      }
    );
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


  ngOnInit() {
    this.listarPacientes();
  }

}
