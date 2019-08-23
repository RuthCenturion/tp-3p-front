import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {BlockUI, BlockUIService, NgBlockUI} from 'ng-block-ui';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class BlockuiHttpInterceptor implements HttpInterceptor {
  @BlockUI() blockUI: NgBlockUI;
  constructor(private blockUIS: BlockUIService,
              private router: Router,
              private cookieService: CookieService) {

  }

  intercept(request: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        withCredentials: 'true'
      }
    });

    this.blockUI.start();

    return next.handle(request)
      .map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          /**
           * TODO en caso de necesitar trato especial con los estados de la respuesta,
           * puede agregar el caso en las siguientes lineas
           */
          if (event.status == 401) {
              this.cookieService.delete('sessiond');
              localStorage.removeItem('sessiond');
              localStorage.removeItem('usuarioLogueado');
              this.router.navigate(['login']);
          }else if(event.status == 403){
            this.router.navigate(['unauthorized']);
          }
          
          this.blockUI.stop();
        }
        /* setTimeout(() => {
          this.blockUI.stop();
        }, 1000); */
        return event;
      })
      .catch((err: any, caught) => {
        console.log(err);
          if (err.status == 401) {
            this.cookieService.delete('sessiond');
            localStorage.removeItem('sessiond');
            localStorage.removeItem('usuarioLogueado');
            this.router.navigate(['login']);
          }else if(err.status == 403){
            this.router.navigate(['unauthorized']);
          }
          this.blockUI.stop();
        /* setTimeout(() => {
          this.blockUI.stop();
        }, 1000); */
        return Observable.throw(err);
      });
  }


}
