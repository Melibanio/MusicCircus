import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink }                  from '@angular/router';
import { ProdutoService, Produto }     from '../../core/produto.service';

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

type ModoModal = 'novo' | 'editar';

interface Toast {
  mensagem: string;
  erro: boolean;
  visivel: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-adm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './adm.html',
  styleUrls: ['./adm.css'],
})
export class Adm implements OnInit {

  // ── Dados ────────────────────────────────────────────────────────────────
  produtos: Produto[]  = [];
  carregando           = true;
  erroCarregamento     = false;

  // ── Categorias disponíveis (mesma lista do produtos.ts) ──────────────────
  categorias: string[] = ['Cordas', 'Percussão', 'Sopro'];

  // ── Filtros ───────────────────────────────────────────────────────────────
  // Substitui: filtroCat, filtroSub, filtroBusca + addEventListener do JS
  filtroBusca     = '';
  filtroCategoria = '';

  // ── Modal adicionar / editar ───────────────────────────────────────────────
  // Substitui: modalOverlay.classList.add/remove('aberto')
  modalAberto  = false;
  modoModal: ModoModal = 'novo';
  produtoEmEdicao: Produto | null = null;

  // ── Formulário reativo ────────────────────────────────────────────────────
  // Substitui: formCat, formNome, formDesc, formPreco + validação manual
  form!: FormGroup;

  // ── Modal de exclusão ─────────────────────────────────────────────────────
  // Substitui: modalDelOverlay + deletarIndex
  modalDeleteAberto    = false;
  produtoParaExcluir: Produto | null = null;

  // ── Toast ─────────────────────────────────────────────────────────────────
  // Substitui: toastEl.textContent + classList.add('visivel')
  toast: Toast = { mensagem: '', erro: false, visivel: false };
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Construtor ────────────────────────────────────────────────────────────
  constructor(
    private produtoService: ProdutoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.inicializarForm();
    this.carregarProdutos();
  }

  // ── Formulário ────────────────────────────────────────────────────────────

  private inicializarForm(): void {
    this.form = this.fb.group({
      nome:       ['', [Validators.required, Validators.minLength(3)]],
      descricao:  [''],
      preco:      [null, [Validators.required, Validators.min(0.01)]],
      precoOriginal: [null, [Validators.required, Validators.min(0.01)]],
      categoria:  ['', Validators.required],
      imagem:     [''],
      isNew:      [false],
      discontinued: [false],
    });
  }

  // ── Getter: lista filtrada ────────────────────────────────────────────────
  // Substitui: função renderizar() com filtros do JS original
  get produtosFiltrados(): Produto[] {
    const busca = this.filtroBusca.toLowerCase().trim();
    const cat   = this.filtroCategoria;

    return this.produtos.filter(p => {
      const passaBusca = !busca || p.nome.toLowerCase().includes(busca);
      const passaCat   = !cat   || p.categoria === cat;
      return passaBusca && passaCat;
    });
  }

  // ── Getters de helper para o template ────────────────────────────────────
  get totalProdutos(): string {
    const n = this.produtos.length;
    return `${n} produto${n !== 1 ? 's' : ''}`;
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  // ── CRUD: Listar ──────────────────────────────────────────────────────────
  // Substitui: carregarProdutos() + renderizar() do JS original
  carregarProdutos(): void {
    this.carregando = true;
    this.erroCarregamento = false;

    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos     = dados;
        this.carregando   = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando       = false;
        this.erroCarregamento = true;
        this.exibirToast('Erro ao carregar produtos. Verifique se o json-server está rodando.', true);
        this.cdr.detectChanges();
      },
    });
  }

  // ── CRUD: Abrir modal Novo ────────────────────────────────────────────────
  // Substitui: btnAbrirModal.addEventListener + limparFormulario()
  abrirModalNovo(): void {
    this.modoModal       = 'novo';
    this.produtoEmEdicao = null;
    this.form.reset({ isNew: false, discontinued: false });
    this.modalAberto = true;
  }

  // ── CRUD: Abrir modal Editar ──────────────────────────────────────────────
  // Substitui: abrirEditar(idx) do JS original
  abrirEditar(produto: Produto): void {
    this.modoModal       = 'editar';
    this.produtoEmEdicao = produto;
    this.form.patchValue(produto);
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto     = false;
    this.produtoEmEdicao = null;
    this.form.reset();
  }

  // ── CRUD: Salvar (POST ou PUT) ────────────────────────────────────────────
  // Substitui: btnSalvar.addEventListener com POST/PUT do json-server
  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.exibirToast('Preencha os campos obrigatórios.', true);
      return;
    }

    const dados: Produto = this.form.value;

    if (this.modoModal === 'novo') {
      // ── Adicionar ── POST
      this.produtoService.incluir(dados).subscribe({
        next: (novo) => {
          this.produtos.push(novo);
          this.fecharModal();
          this.exibirToast(`"${novo.nome}" adicionado com sucesso!`);
          this.cdr.detectChanges();
        },
        error: () => { this.exibirToast('Erro ao adicionar produto.', true); this.cdr.detectChanges(); },
      });

    } else {
      // ── Editar ── PUT
      const atualizado: Produto = { ...dados, id: this.produtoEmEdicao!.id };

      this.produtoService.editar(atualizado).subscribe({
        next: (editado) => {
          const idx = this.produtos.findIndex(p => p.id === editado.id);
          if (idx !== -1) this.produtos[idx] = editado;
          this.fecharModal();
          this.exibirToast(`"${editado.nome}" atualizado com sucesso!`);
          this.cdr.detectChanges();
        },
        error: () => { this.exibirToast('Erro ao editar produto.', true); this.cdr.detectChanges(); },
      });
    }
  }

  // ── CRUD: Confirmar exclusão ──────────────────────────────────────────────
  // Substitui: confirmarExcluir(idx) + modalDelOverlay do JS original
  abrirConfirmarExcluir(produto: Produto): void {
    this.produtoParaExcluir = produto;
    this.modalDeleteAberto  = true;
  }

  fecharModalDelete(): void {
    this.modalDeleteAberto  = false;
    this.produtoParaExcluir = null;
  }

  // ── CRUD: Excluir ── DELETE ───────────────────────────────────────────────
  // Substitui: btnDelConfirmar.addEventListener + produtos.splice() do JS
  confirmarExclusao(): void {
    if (!this.produtoParaExcluir?.id) return;

    const nome = this.produtoParaExcluir.nome;
    const id   = this.produtoParaExcluir.id;

    this.produtoService.excluir(id).subscribe({
      next: () => {
        this.produtos          = this.produtos.filter(p => p.id !== id);
        this.fecharModalDelete();
        this.exibirToast(`"${nome}" excluído.`);
        this.cdr.detectChanges();
      },
      error: () => { this.exibirToast('Erro ao excluir produto.', true); this.cdr.detectChanges(); },
    });
  }

  // ── Filtros ───────────────────────────────────────────────────────────────
  // Substitui: btnLimpar.addEventListener do JS original
  limparFiltros(): void {
    this.filtroBusca     = '';
    this.filtroCategoria = '';
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  // Substitui: função toast() do JS original
  exibirToast(mensagem: string, erro = false): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { mensagem, erro, visivel: true };
    this.cdr.detectChanges();
    this.toastTimer = setTimeout(() => {
      this.toast = { ...this.toast, visivel: false };
      this.cdr.detectChanges();
    }, 2800);
  }
}