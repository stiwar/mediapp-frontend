import { Component, OnInit } from '@angular/core';
import '../login-animation.js';
import { LoginService } from '../_service/login.service.js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MenuService } from '../_service/menu.service.js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string = "";
  error: string = "";

  constructor(private loginService: LoginService, private menuService: MenuService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    (window as any).initialize();
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data =>{

      if(data){

        const helper = new JwtHelperService();

        let token = JSON.stringify(data); //guarda la data en un formato String de json
        sessionStorage.setItem(environment.TOKEN_NAME,token);
        /*procesamiento para consultar los menús que puede ver el usuario que inició sesión 
        (se podría hacer solo pasando la variable 'this.usuario' 
        pero se realiza así para demostrar cómo decodificar el token 
        a través de la librería @auth0/angular-jwt)
        */
        let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
        const decodedToken = helper.decodeToken(tk.access_token);
        //console.log(decodedToken);

        this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
          this.menuService.menuCambio.next(data);// menuCambio: variable reactiva para que el componente login le envíe la data al componente app.component
        });

        //una vez esté logueado (almacenada la variable session storage)
        this.router.navigate(['paciente']);
      }
      
    });
  }

}
