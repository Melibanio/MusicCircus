import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly API = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  listarPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API}?categoria=${categoria}`);
  }

  incluir(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  editar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${produto.id}`, produto);
  }

  descontinuar(id: number): Observable<Produto> {
    return this.http.patch<Produto>(`${this.API}/${id}`, { discontinued: true });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
