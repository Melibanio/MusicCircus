import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Cart } from './pages/cart/cart';
import { Confirmacao } from './pages/confirmacao/confirmacao';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'recuperar', component: Recuperar },
  { path: 'cart', component: Cart },
  { path: 'confirmacao', component: Confirmacao },
];