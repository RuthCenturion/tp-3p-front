import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  pasar = true;
  loginMessage: string = '';
  showMessage: any = false;
  validUsername: any = false;
  validPassword: any = false;
  disabledButton: any = true;
  incorrecto: boolean = false;
  mensaje: any;
  modalUsername: string;
  modalEmail: string;
  username:any;
  email: any;
  usuarioRestablecerForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required]
  });

  constructor(
    private router: Router,
   // private service: LoginService,
    private fb: FormBuilder,
    private toast: ToastrService) {
    this.crearControles();
  }

  ngOnInit() {
  }
  onSubmit() {
    this.submitted = true;
   /* this.service.loginS({
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password
    })
      .subscribe(
        response => {
          if (response != null) {
            if (response.estado == 0) {
              
              localStorage.setItem('sessiond', 'true');
              localStorage.setItem('usuarioLogueado', response.usuario);
              this.router.navigate(['documentos-emitidos-individuales']);
            } else {
              this.incorrecto = true;
              this.mensaje = response.mensaje;
            }
          }
        },
        er => {
          this.incorrecto = true;
          this.showMessage = true;
          this.loginMessage = er.error.mensaje
        }
      )*/
  }
  crearControles() {
    this.usuarioForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  valid() {
    this.validUsername = this.usuarioForm.controls['username'].valid;
    this.validPassword = this.usuarioForm.controls['password'].valid;
    this.disabledButton = true;
    if (this.validUsername && this.validPassword) {
      this.disabledButton = false;
    }
  }

  reestablecerPass() {
    $('#exampleModal').modal('show');
  }

  enviar() {
    let dato: any;
    dato = {
      username: this.usuarioRestablecerForm.value.username,
      email: this.usuarioRestablecerForm.value.email
    };
   /* this.service.reestablecerPass(dato).subscribe(
      response => {
        if (response.estado === 20) {
          this.toast.success(response.mensaje, 'ÉXITO!');
        } else {
          this.toast.warning(response.mensaje);
        }
      },
      error => {
        this.toast.error('Error al reestablecer la contraseña.');
      }
    );*/
  }
  cancelar() {
    this.usuarioRestablecerForm.reset();
    // this.usuarioRestablecerForm.value.email = '';
  }
}
