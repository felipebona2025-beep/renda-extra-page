# Renda Extra — 10 formas de começar a ganhar dinheiro

Landing page estática do e-book e do bônus sobre criação de landing pages.

## Tecnologias

- HTML5
- CSS3 modularizado por responsabilidade
- JavaScript sem dependências

## Estrutura

```text
.
├── index.html
├── assets/images/ebook/    # Pré-visualizações do e-book
├── css/
│   ├── fonts.css           # Declarações de fontes recuperadas
│   ├── tokens.css          # Cores, tipografia e medidas reutilizáveis
│   ├── base.css            # Reset e estilos globais
│   ├── layout.css          # Contêineres e estrutura das seções
│   ├── components.css      # Componentes e responsividade associada
│   └── main.css            # Ponto de entrada dos estilos
├── js/main.js              # Checkout, FAQ, tema, prazo, barra e lightbox
├── robots.txt
└── sitemap.xml
```

## Executar localmente

Abra a pasta em um servidor estático. Por exemplo, com uma extensão de servidor local do editor, use `renda-extra-page` como raiz e abra `index.html`.

## Testes manuais

1. Confirme o carregamento de CSS, JavaScript e das seis imagens.
2. Teste os cinco CTAs e confirme o destino da Cakto.
3. Abra cada uma das cinco prévias; nesta recuperação elas usam o arquivo disponível em 640 px.
4. Teste tema, FAQ, barra fixa e navegação por teclado.
5. Verifique celular, tablet e desktop.

## Produção e Vercel

Não há etapa de build: publique o conteúdo desta pasta como site estático. Antes do deploy, confirme o domínio público e atualize de forma consistente o `canonical`, Open Graph, Twitter Card, `robots.txt` e `sitemap.xml`.

## Integrações e recursos essenciais

- O checkout é configurado em `js/main.js`, na constante `CHECKOUT_URL`.
- Não há variáveis de ambiente nesta recuperação.
- As fontes em `css/fonts.css` ainda dependem de `fonts.gstatic.com`.
- Favicon, manifest e imagem social originais não foram recuperados. As referências externas foram preservadas no HTML para não inventar assets.
- As versões 1280 px das páginas do e-book não foram encontradas. Forneça-as antes de uma otimização visual em telas grandes.
