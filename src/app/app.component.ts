import { Component } from '@angular/core';
import { LoginService } from './_service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'mediapp-frontend';

  constructor(public loginService: LoginService){ //es public porque se necesita usarlo a nivel de html en app.component.html

  }
}
