import { Component } from '@angular/core';

import {FormBuilder,FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})

export class Recuperar {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.formulario = this.fb.group({

      email: ['', [
        Validators.required,
        Validators.email
      ]]

    });

  }

  recuperarSenha() {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    alert('Link de recuperação enviado!');

  }

}