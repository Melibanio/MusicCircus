import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './produto.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<Produto[]>(this.carregar());
  favoritos$ = this.favoritosSubject.asObservable();

  get favoritos(): Produto[] {
    return this.favoritosSubject.getValue();
  }

  isFavorito(produtoId: number): boolean {
    return this.favoritos.some(p => p.id === produtoId);
  }

  toggle(produto: Produto): void {
    if (this.isFavorito(produto.id!)) {
      this.remover(produto.id!);
    } else {
      this.adicionar(produto);
    }
  }

  private adicionar(produto: Produto): void {
    const novos = [...this.favoritos, produto];
    this.favoritosSubject.next(novos);
    this.salvar(novos);
  }

  private remover(produtoId: number): void {
    const novos = this.favoritos.filter(p => p.id !== produtoId);
    this.favoritosSubject.next(novos);
    this.salvar(novos);
  }

  private salvar(favoritos: Produto[]): void {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }

  private carregar(): Produto[] {
    try {
      const dados = localStorage.getItem('favoritos');
      return dados ? JSON.parse(dados) : [];
    } catch {
      return [];
    }
  }
}
