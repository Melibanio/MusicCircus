import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private favoritosService: FavoritosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
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
    if (produto.discontinued || produto.id === undefined) return;
    this.carrinhoService.adicionar({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: produto.imagem });
    this.mensagemCarrinho = `"${produto.nome}" adicionado ao carrinho!`;
    setTimeout(() => { this.mensagemCarrinho = ''; this.cdr.detectChanges(); }, 3000);
  }
}