// ══ O GERENTE DE LOJA — O Componente de Produtos ═════════════════════════════
// Coordena tudo: busca os dados, aplica filtros, delega ao carrinho e favoritos.
// Não faz as tarefas sozinho — injeta os 3 serviços e os usa no momento certo.

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

  // ── Página abre → pede a lista ao ProdutoService ──
  // [Requisito] Listagem via ProdutoService — busca todos os produtos ao abrir a página
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

  // ── Usuário clica no filtro → recalcula automaticamente via Array.filter() ──
  // [Requisito] Filtro por categoria — retorna todos se nenhum selecionado, ou filtra pelo nome da categoria
  get produtosFiltrados(): Produto[] {
    if (!this.categoriaSelecionada) return this.produtos;
    return this.produtos.filter(p => p.categoria === this.categoriaSelecionada);
  }

  filtrar(categoria: string | null): void {
    this.categoriaSelecionada = categoria;
  }

  // ── Usuário clica no coração → delega ao FavoritosService (localStorage) ──
  // [Requisito] Botão favoritar — verifica se o produto já está nos favoritos (coração cheio/vazio)
  isFavorito(produto: Produto): boolean {
    return this.favoritosService.isFavorito(produto.id!);
  }

  // [Requisito] Botão favoritar — adiciona ou remove dos favoritos via FavoritosService
  toggleFavorito(produto: Produto): void {
    this.favoritosService.toggle(produto);
  }

  // ── Usuário clica em Adicionar → verifica esgotado, delega ao CarrinhoService, ativa toast 3s ──
  // [Requisito] Botão Adicionar — chama CarrinhoService.adicionar(); bloqueia se produto estiver esgotado
  adicionarAoCarrinho(produto: Produto): void {
    if (produto.discontinued || produto.id === undefined) return;
    this.carrinhoService.adicionar({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: produto.imagem });
    this.mensagemCarrinho = `"${produto.nome}" adicionado ao carrinho!`;
    setTimeout(() => { this.mensagemCarrinho = ''; this.cdr.detectChanges(); }, 3000);
  }
}