import { Component } from '@angular/core';

import {FormBuilder,FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})

export class Cadastro {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.formulario = this.fb.group({

      nome: ['', [
        Validators.required
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      senha: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],

      confirmarSenha: ['', [
        Validators.required
      ]]

    });

  }

  cadastrar() {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    alert('Cadastro realizado com sucesso!');

  }

}