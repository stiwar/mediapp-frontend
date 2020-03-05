import { Component, OnInit } from '@angular/core';
import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  menus: Menu[] = [];

  constructor(public loginService: LoginService, private menuService: MenuService){ //loginService es public porque se necesita usarlo a nivel de html en app.component.html

  }

  ngOnInit(): void {
    //menuCambio es una variable reactiva que reacciona a this.menuService.menuCambio.next(data) del component login.component.ts
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });
  }
}
