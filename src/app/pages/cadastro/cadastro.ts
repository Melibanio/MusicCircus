import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

function senhasIguais(group: AbstractControl): ValidationErrors | null {
  const s1 = group.get('senha')?.value;
  const s2 = group.get('confirmarSenha')?.value;
  return s1 === s2 ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  formulario!: FormGroup;
  erro = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nome:           ['', [Validators.required]],
      email:          ['', [Validators.required, Validators.email]],
      senha:          ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    }, { validators: senhasIguais });
  }

  campo(nome: string) {
    return this.formulario.get(nome);
  }

  cadastrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.erro = '';
    this.carregando = true;

    const { nome, email, senha } = this.formulario.value;

    this.authService.cadastrar(nome, email, senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/perfil']);
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Erro ao cadastrar. Verifique se o backend está rodando.';
      }
    });
  }
}
