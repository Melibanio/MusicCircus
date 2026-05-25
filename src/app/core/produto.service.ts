// ══ O MENSAGEIRO — O Buscador de Produtos ════════════════════════════════════
// Único arquivo que sabe o endereço da API. Missão: ir ao servidor,
// pedir a lista de produtos e trazer de volta para o componente.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Contrato dos dados — garante que todo produto tem exatamente esses campos ──
export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  categoria: string;
  imagem: string;
  isNew: boolean;
  discontinued: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly API = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  // ── Busca todos os produtos — GET /produtos ──
  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  listarPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API}?categoria=${categoria}`);
  }

  // ── Adiciona novo produto — POST /produtos ──
  incluir(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  // ── Atualiza um produto — PUT /produtos/:id ──
  editar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${produto.id}`, produto);
  }

  // ── Marca como esgotado — PATCH /produtos/:id ──
  descontinuar(id: number): Observable<Produto> {
    return this.http.patch<Produto>(`${this.API}/${id}`, { discontinued: true });
  }

  // ── Remove um produto — DELETE /produtos/:id ──
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}