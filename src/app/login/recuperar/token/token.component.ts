import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { PasswordValidation } from './match';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;  //es la parte variable de la URL
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(fb: FormBuilder, private router: Router, private route: ActivatedRoute, private loginService: LoginService) {
    this.form = fb.group({
      password: [''],
      confirmPassword: ['']
    }, 
    {
        validator: PasswordValidation.MatchPassword
    }
    );
  }

  ngOnInit() {

    this.route.params.subscribe( (params: Params) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if (data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {//para que el usuario alcance a ver el mensaje antes de ser redirigido al login
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    });

  }

  onSubmit() {
    let clave: string = this.form.value.confirmPassword;
    this.loginService.restablecer(this.token, clave).subscribe(data => {
      if (data === 1) {
        this.rpta = 1;
      }
    }, (err => {
      this.rpta = 0;
    }));
  }

}
