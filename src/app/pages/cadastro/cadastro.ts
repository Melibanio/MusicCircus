import { Component } from '@angular/core';
import {FormBuilder,FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-cadastro',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})

function senhasIguais(group: AbstractControl): ValidationErrors | null {
  const s1 = group.get('senha')?.value;
  const s2 = group.get('confirmarSenha')?.value;
  return s1 === s2 ? null : { senhasDiferentes: true };
}

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
      ]]}

      { validators: senhasIguais });
  
    };

  }

  cadastrar() {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    alert('Cadastro realizado com sucesso!');

  }

}