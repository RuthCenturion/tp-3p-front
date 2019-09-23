import { Component, OnInit } from '@angular/core';
import { TableData } from '../../md/md-table/md-table.component';
import { BuscadorService } from 'src/app/services/buscador.service';
declare const $: any;

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  public tableBuscarEmpleado: TableData;
   
  empleadoId: any;
  empleadoNombre: Array<any>;
  buscarEmpleadoNombre: any;
  
  listaBuscarEmpleados: Array<any>;
  listaEmpleadoSeleccionados: Array<any>;
  listaNombreEmpleadoSeleccionados: Array<any>;

  constructor(private service: BuscadorService) {
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
   }

  /*-------------------------------------------------------------------------*/
  listarEmpleadosBuscador(buscadorNombre) {
    // let buscadorNombre = 'Gustavo'
    // let url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    let url = '';
    if (buscadorNombre) {
      url = '?ejemplo=%7B%22nombre%22%3A%22' + buscadorNombre + '%22%7D';
    } else {
      url = '';
    }
    this.listaBuscarEmpleados = new Array<any>();
    this.service.getEmpleadosBuscador(url).subscribe(
      response => {
        console.log('buscadorEmpleados: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(
            empleado => {
              if (empleado.idLocalDefecto) {
                let lista = new Array<any>();

                lista.push(false);
                lista.push(empleado.idPersona); // 0
                lista.push(empleado.nombreCompleto); // 1
                lista.push(empleado.email); // 2
                // local por defecto
                lista.push(empleado.idLocalDefecto.nombre); // 3
                this.listaBuscarEmpleados.push(lista);

                this.tableBuscarEmpleado = {
                  headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
                  dataRows: this.listaBuscarEmpleados
                };
              }
            });
            console.log('lista empleado buscador: ', this.listaBuscarEmpleados);

        }
      }
    );
  }
  /*-------------------------------------------------------------------------*/
  seleccionarVariosEmpleado(idSeleccionado, nombreEmpleado) {
    console.log('idSeleccionado: ', idSeleccionado);
    console.log('lista de id seleccionados: ', this.listaEmpleadoSeleccionados);

    // si no hay elementos en la lista --> agregar
    if (this.listaEmpleadoSeleccionados.length === 0) {
      this.listaEmpleadoSeleccionados.push(idSeleccionado);
      this.listaNombreEmpleadoSeleccionados.push(nombreEmpleado);
    } else {
      // si el id ya está en la lista, no agregar y sacar de la lista, porque des-seleccionó en el check
      if (this.listaEmpleadoSeleccionados.includes(idSeleccionado)) {
        let posicion = this.listaEmpleadoSeleccionados.indexOf(idSeleccionado);
        console.log('se encuentra en la posicion: ', this.listaEmpleadoSeleccionados.indexOf(idSeleccionado));
        // se elimina de la lista
        this.listaEmpleadoSeleccionados.splice(posicion, 1);
        this.listaNombreEmpleadoSeleccionados.splice(posicion, 1);
      } else {
        this.listaEmpleadoSeleccionados.push(idSeleccionado);
        this.listaNombreEmpleadoSeleccionados.push(nombreEmpleado);
      }
    }
    // solo si hay un elemento seleccionado se puede habilitar el boton de aceptar
    console.log('lista de id seleccionados al final: ', this.listaEmpleadoSeleccionados);
  }
  /*-------------------------------------------------------------------------*/
  aceptarEmpleado() {
    // obtener el empleado con el unico id que esta en la lista 'listaSeleccionados'
    this.empleadoId = this.listaEmpleadoSeleccionados[0];
    this.empleadoNombre = this.listaNombreEmpleadoSeleccionados[0];
    // limpiar la grilla del buscadorEmpleado
    this.buscarEmpleadoNombre = null;
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
    $('#exampleModal2').modal('hide');
    // se elimina lo seleccionado
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
  }
  /*-------------------------------------------------------------------------*/
  cancelarBuscarEmpleado() {
    this.buscarEmpleadoNombre = null;
    // this.fila = null;
    this.listaEmpleadoSeleccionados = [];
    this.listaNombreEmpleadoSeleccionados = [];
    this.listaBuscarEmpleados = [];
    this.tableBuscarEmpleado = {
      headerRow: ['', 'Id', 'Nombre', 'Email', 'Local'],
      dataRows: this.listaBuscarEmpleados
    };
  }
  /*-------------------------------------------------------------------------*/
   ngOnInit() {
  //  exampleModal2
    $('#exampleModal2').modal('show');
  }

}
