import { Component, OnInit } from '@angular/core';
import '../login-animation.js';
import { LoginService } from '../_service/login.service.js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    (window as any).initialize();
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data =>{
      let token = JSON.stringify(data); //guarda la data en un formato String de json
      sessionStorage.setItem(environment.TOKEN_NAME,token);

      //una vez esté logueado (almacenada la variable session storage)
      this.router.navigate(['paciente']);
    });
  }

}
