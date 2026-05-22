import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {

  itens: ItemCarrinho[] = [];
  subtotal    = 0;
  total       = 0;
  frete       = 0;
  totalItens  = 0;
  cupomMensagem  = '';
  cupomValido    = false;
  entregaForm!: FormGroup;
  metodoPagamento = 'credit';
  removendoId: number | null = null;
  private sub = new Subscription();

  readonly estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
    'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
    'RS','RO','RR','SC','SP','SE','TO'
  ];


  constructor(
  private carrinhoService: CarrinhoService,
  private fb: FormBuilder,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.assinarCarrinho();
  }

  private criarFormulario(): void {
    this.entregaForm = this.fb.group({
      nome:        ['', [Validators.required, Validators.minLength(2)]],
      sobrenome:   ['', [Validators.required, Validators.minLength(2)]],
      email:       ['', [Validators.required, Validators.email]],
      telefone:    ['', Validators.required],
      cep:         ['', Validators.required],
      endereco:    ['', Validators.required],
      numero:      ['', Validators.required],
      complemento: [''],
      cidade:      ['', Validators.required],
      estado:      ['', Validators.required],
    });
  }

 private assinarCarrinho(): void {
  this.sub.add(
    this.carrinhoService.itens$.subscribe((itens: ItemCarrinho[]) => {
      this.itens = [...itens];
      this.totalItens = itens.reduce((acc: number, i: ItemCarrinho) => acc + i.quantidade, 0);
      this.subtotal = itens.reduce((acc: number, i: ItemCarrinho) => acc + i.preco * i.quantidade, 0);
      this.frete = this.carrinhoService.frete;
      this.total = this.carrinhoService.calcularTotal(this.subtotal);
      this.cdr.detectChanges();
    })
  );
}

  aumentar(id: number): void { this.carrinhoService.aumentarQuantidade(id); }
  diminuir(id: number): void { this.carrinhoService.diminuirQuantidade(id); }

remover(id: number): void {
  this.removendoId = id;
  setTimeout(() => {
    this.carrinhoService.remover(id);
    this.removendoId = null;
  }, 0);
}

  aplicarCupom(codigo: string): void {
    if (!codigo.trim()) {
      this.cupomMensagem = 'Insira um código de cupom.';
      this.cupomValido = false;
      return;
    }
    const resultado = this.carrinhoService.aplicarCupom(codigo);
    this.cupomMensagem = resultado.mensagem;
    this.cupomValido   = resultado.valido;
  }

  finalizarCompra(): void {
    this.entregaForm.markAllAsTouched();
    if (this.itens.length === 0 || this.entregaForm.invalid) return;
    this.router.navigate(['/confirmacao']);
  }

  continuarComprando(): void { this.router.navigate(['/']); }

  trackById(_: number, item: ItemCarrinho): number { return item.id; }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  erro(campo: string): string | null {
    const ctrl = this.entregaForm.get(campo);
    if (!ctrl || !ctrl.touched || ctrl.valid) return null;
    if (ctrl.hasError('required'))  return 'Campo obrigatório.';
    if (ctrl.hasError('email'))     return 'E-mail inválido.';
    if (ctrl.hasError('minlength')) return `Mínimo ${ctrl.errors?.['minlength'].requiredLength} caracteres.`;
    return 'Campo inválido.';
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}