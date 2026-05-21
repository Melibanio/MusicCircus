import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Recuperar } from './pages/recuperar/recuperar';

export const routes: Routes = [

    {
        path: '',
        component: Login
    },

    {
        path: 'cadastro',
        component: Cadastro
    },

    {
        path: 'recuperar',
        component: Recuperar
    }

];

