import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './produto.service';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  itens$ = this.itensSubject.asObservable();

  get itens(): ItemCarrinho[] {
    return this.itensSubject.getValue();
  }

  get totalItens(): number {
    return this.itens.reduce((soma, i) => soma + i.quantidade, 0);
  }

  get subtotal(): number {
    return this.itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);
  }

  adicionar(produto: Produto): void {
    const itensAtuais = this.itens;
    const existente = itensAtuais.find(i => i.produto.id === produto.id);
    if (existente) {
      existente.quantidade++;
      this.itensSubject.next([...itensAtuais]);
    } else {
      this.itensSubject.next([...itensAtuais, { produto, quantidade: 1 }]);
    }
  }

  remover(produtoId: number): void {
    this.itensSubject.next(this.itens.filter(i => i.produto.id !== produtoId));
  }

  aumentar(produtoId: number): void {
    const itens = this.itens;
    const item = itens.find(i => i.produto.id === produtoId);
    if (item) {
      item.quantidade++;
      this.itensSubject.next([...itens]);
    }
  }

  diminuir(produtoId: number): void {
    const itens = this.itens;
    const item = itens.find(i => i.produto.id === produtoId);
    if (item && item.quantidade > 1) {
      item.quantidade--;
      this.itensSubject.next([...itens]);
    }
  }

  limpar(): void {
    this.itensSubject.next([]);
  }
}