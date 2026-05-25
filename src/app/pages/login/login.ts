import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, MatButtonToggleModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  tipoLogin: string = 'cliente';
  formulario!: FormGroup;
  erro = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validarLogin() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.erro = '';
    this.carregando = true;

    const { email, senha } = this.formulario.value;

    this.authService.login(email, senha).subscribe({
      next: (usuario) => {
        this.carregando = false;

        if (!usuario) {
          this.erro = 'E-mail ou senha incorretos.';
          return;
        }

        if (this.tipoLogin === 'admin') {
          if (usuario.perfil !== 'admin') {
            this.erro = 'Acesso negado. Esta conta não é de administrador.';
            return;
          }
          this.router.navigate(['/adm']);
        } else {
          this.router.navigate(['/perfil']);
        }
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Erro ao conectar ao servidor. Verifique se o backend está rodando.';
      }
    });
  }
}
