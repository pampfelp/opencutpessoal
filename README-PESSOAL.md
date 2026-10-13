# OpenCut Pessoal

Este é o repositório principal do OpenCut Pessoal. O código-fonte fica na branch `main`, e a branch `gh-pages` publica o aplicativo em [pampfelp.github.io/opencutpessoal/](https://pampfelp.github.io/opencutpessoal/).

Editor pessoal baseado no código do OpenCut Classic, sob a licença MIT mantida em `LICENSE`. O projeto abre em `/projects`; cada projeto é editado no navegador e permanece em uma cópia local (IndexedDB para a linha do tempo e OPFS para a mídia). O padrão inicial é 1080 × 1920 e pode ser alterado nas configurações do projeto.

## Estado verificado

- Build de produção e checagem TypeScript locais concluídos.
- Em viewport de 390 × 844 no Chrome, um projeto abriu sem rolagem horizontal; uma imagem foi importada, movida entre faixas e cortada por gestos de toque.
- O transporte do Drive passou nos testes simulados de paginação, envio em blocos e sincronização nos dois sentidos entre dois perfis do navegador.
- Um projeto com imagem exportou MP4 localmente; o arquivo gerado passou na checagem básica do contêiner.
- A versão estática para GitHub Pages passou por teste em Chrome de 1440 × 900 e 390 × 844: a lista abriu, criou projeto, carregou o editor e exportou MP4 de uma imagem no layout móvel.
- Login Google, envio real ao Drive e edição/exportação em aparelho físico ainda exigem validação antes de usar como fluxo principal.

## Preparar o Google Drive

1. Use o projeto Google Cloud **OpenCut Pessoal** criado para este editor. O cliente OAuth do projeto **SolarGreen** não pertence a ele.
2. Ative a [API do Google Drive](https://console.cloud.google.com/apis/library/drive.googleapis.com) nesse projeto.
3. Em [Google Auth Platform — Branding e Público-alvo](https://console.cloud.google.com/auth/overview), configure o nome **OpenCut Pessoal** e seus próprios endereços de suporte e contato. Escolha **Externo** para conta Google pessoal. Em **Acesso a dados**, adicione o escopo `https://www.googleapis.com/auth/drive.file`.
4. Em [Clientes](https://console.cloud.google.com/auth/clients), crie um cliente OAuth **Aplicativo da Web** chamado **OpenCut Pessoal**. Em **Origens JavaScript autorizadas**, adicione `http://localhost`, `http://localhost:3000` e `https://pampfelp.github.io`. O modelo de token usado pelo editor não precisa de URI de redirecionamento.
5. Copie somente o **ID do cliente** para `NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID` em `apps/web/.env.local` (uso local) e `apps/pages/.env.local` (build público). Para o build público, use também `NEXT_PUBLIC_SITE_URL=https://pampfelp.github.io/opencutpessoal` e `NEXT_PUBLIC_BASE_PATH=/opencutpessoal`. Não coloque segredo OAuth no código ou em variável `NEXT_PUBLIC_`.

Em **Público-alvo**, a publicação **Em teste** exige cadastrar a própria conta como usuário de teste e suas autorizações expiram após sete dias. Para uso pessoal contínuo, publique **Em produção** depois de conferir as configurações. O escopo `drive.file` é classificado pelo Google como não sensível. O Google informa que apps de uso pessoal com menos de 100 usuários podem continuar sem a verificação OAuth completa, embora possam apresentar aviso de app não verificado.

O editor solicita apenas `drive.file`: acesso aos arquivos que ele cria ou que você seleciona para ele. Os projetos ficam numa pasta **OpenCut Pessoal** do seu Drive. A mídia é enviada em arquivos separados; o `project.json` é gravado depois deles. O botão **Sincronizar** aparece na lista de projetos e no editor. Depois de conectar, alterações salvas no editor disparam uma nova sincronização após alguns segundos.

Antes de alternar aparelhos, aguarde a indicação **Sincronizado**. No outro aparelho, abra a lista de projetos e use **Sincronizar** antes de abrir o projeto. Se ambos os aparelhos alterarem o mesmo projeto desde a última sincronização, o editor mostra **Conflito** e preserva as duas cópias sem sobrescrever automaticamente.

O token Google fica apenas na memória da aba e vence; depois será preciso conectar novamente. A edição usa armazenamento local do navegador, portanto limpar os dados do site pode remover a cópia local. O Drive consome a cota de armazenamento da sua conta e transferir vídeos grandes pode levar tempo. O celular também precisa de espaço e capacidade para decodificar e exportar os arquivos.

## Publicação no GitHub Pages

O editor é um aplicativo estático em [pampfelp.github.io/opencutpessoal/](https://pampfelp.github.io/opencutpessoal/). Qualquer pessoa pode abrir a interface, conforme autorizado pelo usuário; os projetos e vídeos de cada pessoa permanecem no armazenamento local do próprio navegador e só entram no Google Drive da conta que autorizar a sincronização. O código publicado solicita `noindex`, mas isso não restringe acesso.

O aplicativo em `apps/pages` reutiliza os componentes do editor em `apps/web`. Rode `bun run build` dentro de `apps/pages` e depois `node scripts/assemble-pages.mjs` na raiz. O resultado em `site-out/` reúne o editor, seus recursos, `.nojekyll` e as páginas públicas de `public-pages/`. Publique esse resultado na raiz da branch `gh-pages` deste mesmo repositório. Confira a lista de projetos, a edição e uma exportação no endereço público.

O GitHub Pages não executa a rota de busca de sons do OpenCut. Ela já estava sem chave Freesound configurada nesta cópia; o usuário pode importar os próprios arquivos de áudio.

A apresentação e as políticas aprovadas são publicadas no mesmo site. No Branding do Google Auth Platform, use como página inicial `https://pampfelp.github.io/opencutpessoal/sobre.html`, política `https://pampfelp.github.io/opencutpessoal/privacidade.html`, termos `https://pampfelp.github.io/opencutpessoal/termos.html` e domínio autorizado `pampfelp.github.io`. Depois salve e tente **Publicar app**. Só use o Google Search Console se o Google pedir verificação de propriedade do domínio.

## Rodar localmente

Com Bun instalado, na raiz do repositório:

```powershell
bun install --frozen-lockfile
bun run dev:web
```

Abra `http://localhost:3000`. Para acessar de outro aparelho, use `https://pampfelp.github.io/opencutpessoal/`. A origem HTTPS precisa constar no cliente OAuth para conectar o Drive.

## Verificação

```powershell
node node_modules/typescript/bin/tsc --noEmit --project apps/web/tsconfig.json
node --experimental-transform-types --test apps/web/src/services/drive/__tests__/api.test.ts
npm install --prefix design/test-tools
node design/test-tools/drive-smoke.cjs
```

O último teste exige Chrome instalado e o servidor de desenvolvimento aberto em `http://localhost:3000`. Com `TEST_EXPORT=1`, ele também exporta um MP4 e confere o contêiner sem deixar o arquivo no projeto.
