import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProdutoService, Produto } from '../../core/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { FavoritosService } from '../../core/favoritos.service';

@Component({
  selector: 'app-produtos',
  imports: [CurrencyPipe],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  categorias: string[] = ['Cordas', 'Percussão', 'Sopro'];
  categoriaSelecionada: string | null = null;
  produtos: Produto[] = [];
  carregando = true;
  mensagemCarrinho = '';

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  get produtosFiltrados(): Produto[] {
    if (!this.categoriaSelecionada) return this.produtos;
    return this.produtos.filter(p => p.categoria === this.categoriaSelecionada);
  }

  filtrar(categoria: string | null): void {
    this.categoriaSelecionada = categoria;
  }

  isFavorito(produto: Produto): boolean {
    return this.favoritosService.isFavorito(produto.id!);
  }

  toggleFavorito(produto: Produto): void {
    this.favoritosService.toggle(produto);
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (produto.discontinued) return;
    this.carrinhoService.adicionar(produto);
    this.mensagemCarrinho = `"${produto.nome}" adicionado ao carrinho!`;
    setTimeout(() => this.mensagemCarrinho = '', 3000);
  }

  get totalCarrinho(): number {
    return this.carrinhoService.totalItens;
  }
}