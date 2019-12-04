import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { NOTIFY } from '../../commons/app-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';

declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  usuario: any;
  pass: any;
  listaUsuarioSistema: Array<any>;

  constructor(private element: ElementRef,
    private service: LoginService,
    private router: Router, ) {
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;
  }
  /*-------------------------------------------------------------------------*/
  ngOnInit() {
    var navbar : HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function() {
        // after 1000 ms we add the class animated to the login/register card
        card.classList.remove('card-hidden');
    }, 700);
    // stock-pwfe/persona?ejemplo={"soloUsuariosDelSistema":true}
    let url = '{"soloUsuariosDelSistema":true}';
    url = '?ejemplo=' + encodeURIComponent(url);
    this.listaUsuarioSistema = new Array<any>();

  /*  this.service.getUsuario(url).subscribe(
      response => {
        console.log('usuarios: ', response);
        if (response.totalDatos > 0) {
          response.lista.forEach(user => {
            let lista = new Array<any>();
            lista.push(user.nombre);
            lista.push(user.nombreCompleto);
            this.listaUsuarioSistema.push(lista);
          });
        }
      }
    );*/
  }
  /*-------------------------------------------------------------------------*/
  sidebarToggle() {
      var toggleButton = this.toggleButton;
      var body = document.getElementsByTagName('body')[0];
      var sidebar = document.getElementsByClassName('navbar-collapse')[0];
      if (this.sidebarVisible === false) {
          setTimeout(function() {
              toggleButton.classList.add('toggled');
          }, 500);
          body.classList.add('nav-open');
          this.sidebarVisible = true;
      } else {
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          body.classList.remove('nav-open');
      }
  }
  /*-------------------------------------------------------------------------*/
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }
  /*-------------------------------------------------------------------------*/
  ingresar() {
    console.log('ingresado: ', this.usuario);
    console.log('ingresado: ', this.pass);
    this.router.navigate(['dashboard']);
    /*
    let usuarioCorrecto = false;
    this.listaUsuarioSistema.forEach(
      user => {
        if (user[0] === this.usuario || user[1] === this.usuario ) {
          usuarioCorrecto = true;
        }
      }
    );
    if (usuarioCorrecto) {
      console.log('logueado: ', this.usuario);
      this.router.navigate(['dashboard']);
    } else {
      console.log('no logueado: ', this.usuario);
      this.usuario = '';
      this.showNotification('Usuario no válido.', NOTIFY.DANGER);
    }
    */
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
}
