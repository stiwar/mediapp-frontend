import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'; //cuidado al importar la interface CanActivate, debe ser de aquí
import { LoginService } from './login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MenuService } from './menu.service';
import { Menu } from '../_model/menu';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(private router: Router, private loginService: LoginService, private menuService: MenuService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    
    const helper = new JwtHelperService();
    let rpta = this.loginService.estaLogeado();

    if(!rpta){
      
      sessionStorage.clear();
      this.router.navigate(['login']);  
      return false;

    }else{//Si está logueado, también se debe proteger el menú según el rol del usuario que se logueó
      
      let token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));

      //si el Token no esta expirado
      if (!helper.isTokenExpired(token.access_token)) {

        // /consulta
        // compare si /consulta puede ser accededido por el rol ADMIN
        const decodedToken = helper.decodeToken(token.access_token);
        let url = state.url;  //la variable state es una variable predefinida y con url obtengo la url a la cuál quiere ingresar el usuario logueado (a qué opción de menú)

        /*
        cuando se quiere manipular la respuesta de los observables, 
        no se puede suscribir a el (utilizando el .subscribe) 
        porque todavía la información quizás no está preparada en ese momento.
        Se debe utilizar funciones reactivas,
        por eso se utiliza funciones reactivas, por eso el llamado al método pipe de abajo
        */
       /*
        si dentro de un guard se va a hacer una llamada a un servicio, nunca hacer un subscribe
        siempre trabajarlo con una función reactiva, como pipe y map (consultar el por qué?)
       */
       /*
        el siguiente bloque de return se ejecuta primero en un hilo aparte 
        y cuando se termina, continúa con el hilo principal desde donde empezó este método canActivate
       */
        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map( (data: Menu[]) => {
          this.menuService.menuCambio.next(data);

            let cont = 0;
            for (let m of data) {
              //if (m.url === url) {//no funciona correctamente al momento de refrescar un formulario de actualización
              if ( url.startsWith(m.url) ) {
                cont++;
                break;
              }
            }

            if (cont > 0) {
              return true;
            } else {
              this.router.navigate(['not-401']);
              return false;
            }
        }));

      } else {
        //si el token ya expiró
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
    }
  }
}
