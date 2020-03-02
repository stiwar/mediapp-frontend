import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'; //cuidado al importar la interface CanActivate, debe ser de aquí
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(private router: Router, private loginService: LoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    
    let rpta = this.loginService.estaLogeado();

    if(!rpta){
      
      sessionStorage.clear();
      this.router.navigate(['login']);  
      return false;

    }else{
      return true;
    }
  }
}
