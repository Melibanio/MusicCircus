# MusicCircus — Como rodar e observações técnicas

## Como rodar o projeto

### 1. Clonar e instalar

```bash
git clone https://github.com/Melibanio/MusicCircus
cd MusicCircus
npm install
```

### 2. Abrir dois terminais

**Terminal 1 — backend (json-server):**
```bash
npm run backend
```
Sobe a API em `http://localhost:3000` com os produtos do `db.json`.

**Terminal 2 — frontend (Angular):**
```bash
npm start
```
Abre o site em `http://localhost:4200`.

> Os dois precisam estar rodando ao mesmo tempo para os produtos aparecerem.

---

## O que está de acordo com o curso

- `json-server` com `db.json` como backend de desenvolvimento
- `HttpClient` + `Observable` + `subscribe()` para buscar dados da API
- `ReactiveFormsModule` com `FormBuilder` e `Validators` (login, cadastro)
- Roteamento com `RouterLink` e `app.routes.ts`
- Componentes standalone com `imports[]`

---

## O que vai além do curso — pontos para analisar juntos

### 1. `ChangeDetectorRef.detectChanges()`

Adicionado em `produtos.ts` e `adm.ts`. Necessário porque o Angular 21 não inclui o `zone.js` por padrão — sem ele, a tela não atualiza após o retorno de chamadas HTTP (`subscribe`). O curso provavelmente ensinou com `zone.js` ativo, onde isso não é necessário.

Se quiser simplificar: podemos adicionar `zone.js` ao projeto e remover todos os `detectChanges()`.

### 2. `BehaviorSubject` no `CarrinhoService`

O serviço do carrinho usa `BehaviorSubject` do RxJS para manter o estado reativo. É um padrão mais avançado que vai além do conteúdo do semestre. Dependendo do que foi pedido na entrega, pode ser simplificado.

### 3. `Omit<ItemCarrinho, 'quantidade'>` no `adicionar()`

Tipagem TypeScript avançada. Não muda o comportamento, só torna o tipo mais restrito. Pode ser simplificado para `any` ou para um tipo mais direto se necessário.

---

## Arquivos alterados nos últimos commits

| Arquivo | O que foi corrigido |
|---|---|
| `app.routes.ts` | Rotas alinhadas com os links do header (`products`, `about`, `cart`) + import correto do `HomeComponent` |
| `header.ts` | Removido import não utilizado (`RouterLinkActive`) |
| `produtos.ts` | `ChangeDetectorRef` adicionado; chamada `adicionar()` corrigida para bater com o tipo do serviço |
| `adm.ts` | `ChangeDetectorRef` adicionado em todos os callbacks HTTP e no toast |
| `package.json` | Script `backend` adicionado para rodar o json-server |
