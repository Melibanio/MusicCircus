
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Cart } from './pages/cart/cart';
import { Confirmacao } from './pages/confirmacao/confirmacao';
import { Produtos } from './pages/produtos/produtos';
import { AboutComponent as About } from './pages/about/about';
import { Perfil } from './pages/perfil/perfil';
import { Adm } from './pages/adm/adm';

export const routes: Routes = [
  { path: '',          redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      component: Home },
  { path: 'login',     component: Login },
  { path: 'cadastro',  component: Cadastro },
  { path: 'recuperar', component: Recuperar },
  { path: 'carrinho',  component: Cart },
  { path: 'confirmacao', component: Confirmacao },
  { path: 'produtos',  component: Produtos },
  { path: 'sobre',     component: About },
  { path: 'perfil',    component: Perfil },
  { path: 'adm',       component: Adm },
  { path: '**',        redirectTo: 'home' },
];


