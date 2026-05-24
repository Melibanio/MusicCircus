
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Cart } from './pages/cart/cart';
import { Confirmacao } from './pages/confirmacao/confirmacao';
import { Produtos } from './pages/produtos/produtos';

export const routes: Routes = [
    { path: '',     redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: Home },

    { path: '**',   redirectTo: 'home' }, 

    {
        path: 'Login',
        component: Login
    },

    {
        path: 'cadastro',
        component: Cadastro
    },

    {
        path: 'recuperar',
        component: Recuperar
    },

    { 
      path: 'cart', component: Cart 
    },

    { 
      path: 'confirmacao', component: Confirmacao 
    },

    { 
      path: 'produtos', component: Produtos
    },

];


