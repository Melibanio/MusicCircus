// src/app/core/carrinho.service.ts
// Nicolle Lima

import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

const FRETE_PADRAO = 15.00;

const CUPONS: Record<string, number | 'frete'> = {
  'DESC10':       0.10,
  'DESC20':       0.20,
  'FRETEGRATIS': 'frete',
};

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  // ── estado central 
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([
    { id: 1, nome: 'Guitarra Epiphone Les Paul Tribute Plus - EBONY BURST', preco: 3790.50, imagem: 'img/guitarra-epiphone.jpg',  quantidade: 1 },
    { id: 2, nome: 'Controlador KORG USB-MIDI - NANOKONTROL2',              preco:  519.32, imagem: 'img/controlador-korg.jpg',   quantidade: 1 },
    { id: 3, nome: 'Kit Suporte Em X + Banqueta Para Teclado',              preco:  266.71, imagem: 'img/suporte-em-x.jpg',       quantidade: 1 },
  ]);

  private descontoSubject   = new BehaviorSubject<number>(0);
  private freteGratisSubject = new BehaviorSubject<boolean>(false);

  // ── observables públicos 
  itens$       = this.itensSubject.asObservable();
  desconto$    = this.descontoSubject.asObservable();
  freteGratis$ = this.freteGratisSubject.asObservable();

  totalItens$ = this.itens$.pipe(
    map(itens => itens.reduce((acc, i) => acc + i.quantidade, 0))
  );

  subtotal$ = this.itens$.pipe(
    map(itens => itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0))
  );

  // ── métodos de carrinho 
  adicionar(produto: Omit<ItemCarrinho, 'quantidade'>): void {
    const atual = this.itensSubject.value;
    const existe = atual.find(i => i.id === produto.id);
    if (existe) {
      this.itensSubject.next(
        atual.map(i => i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)
      );
    } else {
      this.itensSubject.next([...atual, { ...produto, quantidade: 1 }]);
    }
  }

  aumentarQuantidade(id: number): void {
    this.itensSubject.next(
      this.itensSubject.value.map(i =>
        i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
      )
    );
  }

  diminuirQuantidade(id: number): void {
    this.itensSubject.next(
      this.itensSubject.value
        .map(i => i.id === id ? { ...i, quantidade: Math.max(1, i.quantidade - 1) } : i)
    );
  }

  remover(id: number): void {
    this.itensSubject.next(
      this.itensSubject.value.filter(i => i.id !== id)
    );
  }

  limpar(): void {
    this.itensSubject.next([]);
    this.descontoSubject.next(0);
    this.freteGratisSubject.next(false);
  }

  // ── cupom
  aplicarCupom(codigo: string): { valido: boolean; mensagem: string } {
    const chave = codigo.trim().toUpperCase();
    const cupom = CUPONS[chave];

    if (!cupom) {
      return { valido: false, mensagem: 'Cupom inválido. Tente novamente.' };
    }

    if (cupom === 'frete') {
      this.freteGratisSubject.next(true);
      return { valido: true, mensagem: 'Cupom aplicado! Frete grátis.' };
    }

    this.descontoSubject.next(cupom);
    return { valido: true, mensagem: `Cupom aplicado! ${cupom * 100}% de desconto.` };
  }

  // ── cálculos 
  get frete(): number {
    return this.freteGratisSubject.value ? 0 : FRETE_PADRAO;
  }

  calcularTotal(subtotal: number): number {
    const subtotalComDesconto = subtotal * (1 - this.descontoSubject.value);
    return subtotalComDesconto + this.frete;
  }

  calcularSubtotalComDesconto(subtotal: number): number {
    return subtotal * (1 - this.descontoSubject.value);
  }
}
