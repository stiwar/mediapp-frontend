import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu } from '../_model/menu';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuCambio = new Subject<Menu[]>();//variable reactiva
  url: string = `${environment.HOST_URL}`;

  constructor(private http: HttpClient) { }

  /*
  este es un ejemplo suponiendo el caso de que no viniera el token,
  es decir, enviar datos de token en la cabecera desde el front,
  sino hubiera bastado con: return this.http.get<Menu[]>(`${this.url}/menus`);
  lo anterior es posible gracias a la librería @auth0/angular-jwt (JwtModule, ver video 14 minuto 00, leer https://github.com/auth0/angular2-jwt para entender cómo se configura y funciona), 
  sino tocaría hacerlo como está en el código de abajo siempre en cada petición hhtp!
  */
  listar(){
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;
    return this.http.get<Menu[]>(`${this.url}/menus`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  listarPorUsuario(nombre: string) {
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;
    return this.http.post<Menu[]>(`${this.url}/menus/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

}
