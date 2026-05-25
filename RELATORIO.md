# Relatório de Revisão — MusicCircus
**Data:** 25/05/2026  
**Projeto:** MusicCircus — Angular 21 + json-server  
**Revisado por:** Oswaldo (integrante Produtos)

---

## Bugs encontrados e corrigidos

### 1. Imagens sumindo na página Home
**Arquivo:** `src/app/pages/home/home.ts`  
**Causa:** As imagens das seções *Categorias* e *Cursos* usavam o caminho `/public/IMG/...`, mas o Angular serve a pasta `public` diretamente na raiz `/`. O caminho correto é `/IMG/...`.  
**Correção:** Removido o prefixo `/public` de todos os caminhos de imagem em `categorias[]` e `cursos[]`.

---

### 2. Erro de compilação em `perfil.ts` (TS2393)
**Arquivo:** `src/app/pages/perfil/perfil.ts`  
**Causa:** O arquivo tinha **dois métodos `ngOnInit()`** declarados — um lendo direto do `localStorage.getItem('usuarioLogado')` e outro usando o `AuthService`. O TypeScript não permite implementações duplicadas.  
**Correção:** Os dois métodos foram mesclados em um único `ngOnInit` que:
1. Tenta ler a sessão via `AuthService` (chave `'mc_usuario'`)
2. Se não encontrar, cai no fallback da chave `'usuarioLogado'`

Isso garante compatibilidade com ambos os fluxos de login enquanto o time alinha a chave definitiva.

---

### 3. Chave de localStorage divergente (Auth × Perfil)
**Arquivos:** `src/app/core/auth.service.ts` × `src/app/pages/perfil/perfil.ts`  
**Causa:** O `AuthService` (Estella) salva a sessão na chave `'mc_usuario'`, mas o `perfil.ts` original da Melissa lia da chave `'usuarioLogado'`. Resultado: fazer login não populava os campos do perfil.  
**Correção:** O `ngOnInit` do perfil agora tenta as duas chaves (veja item 2 acima).  
**Recomendação:** O time deve padronizar numa única chave — sugestão: usar sempre `'mc_usuario'` via `AuthService.getUsuarioLogado()`.

---

## Aviso: arquivo duplicado (não causa erro, mas pode confundir)

| Arquivo | Situação |
|---|---|
| `src/app/core/carrinho.service.ts` | **Não é importado por ninguém** — código morto |
| `src/app/services/carrinho.service.ts` | Versão correta, usada por `produtos.ts`, `cart.ts` e `confirmacao.ts` |

O `core/carrinho.service.ts` tem uma interface diferente (`ItemCarrinho` com campo `produto: Produto`) e nunca é usado. Pode causar confusão na hora de editar. **Recomendação: deletar** `src/app/core/carrinho.service.ts`.

---

## Estado atual do projeto

| Página | Compile | Visual |
|---|---|---|
| Home | ✅ | ✅ (imagens corrigidas) |
| Login / Cadastro | ✅ | ✅ |
| Produtos | ✅ | ✅ |
| Carrinho (Cart) | ✅ | ✅ |
| Confirmação | ✅ | ✅ |
| Perfil | ✅ | ✅ (após correção de `ngOnInit`) |
| Admin | ✅ (1 warning) | ✅ |
| About | ✅ | ✅ |

> **Warning não-crítico:** `adm.ts` importa `RouterLink` mas não usa no template. Pode remover da lista de `imports[]` do componente.

---

## Como rodar localmente

```bash
# 1. Instalar dependências (só na primeira vez)
npm install

# 2. Terminal 1 — API (json-server na porta 3000)
npx json-server db.json

# 3. Terminal 2 — Angular (dev server na porta 4200)
npm start
```

Acesse: `http://localhost:4200`

---

## Commits desta revisão

| Hash | Descrição |
|---|---|
| `b6e099f` | docs: comentários `[Requisito]` na página de Produtos |
| `4522fcb` | fix: remove `ngOnInit` duplicado em `perfil.ts` |
| `b5e1bbb` | fix: caminhos de imagem na Home (`/public/IMG` → `/IMG`) |
