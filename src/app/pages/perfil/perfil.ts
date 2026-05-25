import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FavoritosService } from '../../core/favoritos.service';
import { Produto } from '../../core/produto.service';

// ─── Interfaces de dados ──────────────────────────────────────────────────────

interface Pedido {
  numero: string;
  data: string;
  status: 'Entregue' | 'Em transporte' | 'Processando';
}

interface Favorito {
  id: number;
  nome: string;
  categoria: string;
  imagem: string;
  selecionado: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {

  // ── Estado de autenticação ────────────────────────────────────────────────
  usuarioLogado = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    // Tenta AuthService primeiro ('mc_usuario'); fallback para 'usuarioLogado' (chave do login da Melissa)
    const usuario = this.authService.getUsuarioLogado()
      ?? (() => { const s = localStorage.getItem('usuarioLogado'); return s ? JSON.parse(s) : null; })();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuarioLogado = true;
    this.nomePerfil   = usuario.nome  || '';
    this.formNome     = usuario.nome  || '';
    this.formEmail    = usuario.email || '';
    this.formTelefone = usuario.telefone || '';

    this.favoritos = this.favoritosService.favoritos.map((p: Produto) => ({
      id:         p.id!,
      nome:       p.nome,
      categoria:  p.categoria,
      imagem:     p.imagem,
      selecionado: false,
    }));
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ── Aba ativa ─────────────────────────────────────────────────────────────
  // Substitui toda a lógica de botoesAbas.forEach + classList.add/remove.
  // O template usa [class.active]="abaAtiva === 'dados'" para cada botão/seção.
  abaAtiva: 'dados' | 'favoritos' | 'pedidos' = 'dados';

  // ── Dados do perfil ───────────────────────────────────────────────────────
  nomePerfil = 'Laura Melo';
  fotoPerfilUrl = 'https://i.imgur.com/2DhmtJ4.png';
  mostrarIconeCamera = true;

  // ── Formulário de dados pessoais ──────────────────────────────────────────
  // Cada campo é uma propriedade — [(ngModel)] faz o two-way binding.
  formNome = '';
  formEmail = '';
  formTelefone = '';
  formSenha = '';

  // Erros de validação — substitui input.style.borderColor = 'red'
  erros: { [campo: string]: string } = {};

  // ── Pedidos ───────────────────────────────────────────────────────────────
  // Dados hardcoded do HTML original viram array tipado para @for no template.
  pedidos: Pedido[] = [
    { numero: '#94821', data: '20/05/2026', status: 'Entregue'      },
    { numero: '#94822', data: '19/05/2026', status: 'Em transporte' },
    { numero: '#94823', data: '15/05/2026', status: 'Processando'   },
  ];

  // ── Favoritos — carregados do FavoritosService (localStorage) ───────────
  favoritos: Favorito[] = [];

  // ── Troca de aba ─────────────────────────────────────────────────────────
  // Substitui: botoesAbas.forEach(botao => botao.addEventListener('click', ...))
  trocarAba(aba: 'dados' | 'favoritos' | 'pedidos'): void {
    this.abaAtiva = aba;
  }

  // ── Upload de foto ────────────────────────────────────────────────────────
  // Substitui: inputFotoPerfil.addEventListener('change', (event) => { FileReader... })
  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = (e) => {
      this.fotoPerfilUrl   = e.target?.result as string;
      this.mostrarIconeCamera = false;   // substitui: iconeCamera.style.display = 'none'
    };

    leitor.readAsDataURL(arquivo);
  }

  // ── Salvar dados ──────────────────────────────────────────────────────────
  // Substitui: botaoSalvar.addEventListener('click', ...) com regex e alerts.
  // Validação via regex igual ao original, mas erros ficam em this.erros
  // para o template exibir mensagens inline (sem alert).
  salvarDados(): void {
    this.erros = {};

    const regexNome     = /^[A-Za-zÀ-ÿ\s]+$/;
    const regexEmail    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefone = /^[0-9()\s-]+$/;

    if (!regexNome.test(this.formNome.trim())) {
      this.erros['nome'] = 'Nome inválido. Use apenas letras.';
    }

    if (!regexEmail.test(this.formEmail.trim())) {
      this.erros['email'] = 'E-mail inválido.';
    }

    if (!regexTelefone.test(this.formTelefone.trim())) {
      this.erros['telefone'] = 'Telefone inválido. Use apenas números e ( ) - .';
    }

    if (this.formSenha.trim().length < 6) {
      this.erros['senha'] = 'Senha muito curta. Mínimo 6 caracteres.';
    }

    if (Object.keys(this.erros).length > 0) return;

    // Atualiza o nome exibido na sidebar — substitui: nomePerfil.textContent = nome.value
    this.nomePerfil = this.formNome;

    alert('Dados salvos com sucesso!');
  }

  // ── Favoritos: toggle de seleção ──────────────────────────────────────────
  // Substitui: cartao.addEventListener('click', () => cartao.classList.toggle('selected'))
  toggleFavorito(favorito: Favorito): void {
    favorito.selecionado = !favorito.selecionado;
  }
}
