import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = `${environment.HOST_URL}/oauth/token`;

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, contrasena: string){
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post(this.url, body, {
      headers: new HttpHeaders()
                   .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
                   .set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
      
  }

  estaLogeado(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);//sirve para verificar si hay un token de almacenamineto en el sessionStorage
    return token != null;
  }

  cerrarSesion(){
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;
    this.http.get(`${environment.HOST_URL}/usuarios/anular/${access_token}`).subscribe(()=>{
      sessionStorage.clear();
      this.router.navigate(['login']);
    });
  }

}
