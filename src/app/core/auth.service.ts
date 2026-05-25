import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: 'cliente' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/usuarios';
  private readonly CHAVE = 'mc_usuario';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<Usuario | null> {
    return this.http
      .get<Usuario[]>(`${this.API}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`)
      .pipe(
        map(lista => (lista.length > 0 ? lista[0] : null)),
        tap(usuario => {
          if (usuario) {
            localStorage.setItem(this.CHAVE, JSON.stringify(usuario));
          }
        })
      );
  }

  cadastrar(nome: string, email: string, senha: string): Observable<Usuario> {
    const novoUsuario: Usuario = { nome, email, senha, perfil: 'cliente' };
    return this.http.post<Usuario>(this.API, novoUsuario).pipe(
      tap(usuario => localStorage.setItem(this.CHAVE, JSON.stringify(usuario)))
    );
  }

  getUsuarioLogado(): Usuario | null {
    const dados = localStorage.getItem(this.CHAVE);
    return dados ? JSON.parse(dados) : null;
  }

  estaLogado(): boolean {
    return !!this.getUsuarioLogado();
  }

  logout(): void {
    localStorage.removeItem(this.CHAVE);
  }
}
