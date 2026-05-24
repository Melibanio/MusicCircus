import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacao.html',
  styleUrl: './confirmacao.css'
})
export class Confirmacao implements OnInit {

  numeroPedido = '';

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.numeroPedido = Math.floor(Math.random() * 900000 + 100000).toString();
    this.carrinhoService.limpar();
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}