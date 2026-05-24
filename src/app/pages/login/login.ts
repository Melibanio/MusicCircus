import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {FormBuilder,FormGroup,Validators,FormsModule,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,MatButtonToggleModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  tipoLogin: string = 'cliente';

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.formulario = this.fb.group({

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      senha: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]

    });

  }

  validarLogin() {

    if (this.formulario.invalid) {
      return;
    }

    alert('Login realizado com sucesso!');

  }

}


