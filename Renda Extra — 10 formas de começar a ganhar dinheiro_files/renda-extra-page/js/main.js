/* ============================================================
   RENDA EXTRA — 10 FORMAS DE COMEÇAR A GANHAR DINHEIRO
   Script da página de vendas
   ============================================================ */

/* ------------------------------------------------------------
   >>> LINK DO PRODUTO NA CAKTO <<<
   É o ÚNICO lugar que você precisa editar: todos os botões com
   o atributo data-checkout passam a apontar para este link.
   Enquanto o texto SEU-LINK-AQUI estiver aqui, os botões apenas
   rolam a página até a seção de oferta.
   ------------------------------------------------------------ */
var CHECKOUT_URL = "https://pay.cakto.com.br/8pxdbij_1146788";

/* ------------------------------------------------------------
   >>> PRAZO DA OFERTA <<<
   Coloque em "ate" a data e a hora em que o preço vai mudar de
   verdade, no formato  "2026-10-12T23:59:59-03:00"
   (o -03:00 é o horário de Brasília).

   - O prazo é o mesmo para todos os visitantes.
   - Com "ate" vazio, o cronômetro não aparece.
   - Quando o prazo acaba, o cronômetro some sozinho. Lembre de
     atualizar o preço na página e na Cakto nesse momento.
   ------------------------------------------------------------ */
var PRAZO_OFERTA = {
  ate: "",
  texto: "Preço de lançamento termina em"
};

(function () {
  "use strict";

  /* ---------- 1. Aplica o link de checkout em todos os CTAs ---------- */
  function aplicarCheckout() {
    var configurado = CHECKOUT_URL && CHECKOUT_URL.indexOf("SEU-LINK-AQUI") === -1;
    if (!configurado) {
      console.warn(
        "[Renda Extra] Link da Cakto ainda não configurado. " +
        "Edite CHECKOUT_URL no início de js/main.js."
      );
      return;
    }

    var botoes = document.querySelectorAll("[data-checkout]");
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].setAttribute("href", CHECKOUT_URL);
      botoes[i].setAttribute("target", "_blank");
      botoes[i].setAttribute("rel", "noopener");
    }
  }

  /* ---------- 2. FAQ: abre uma pergunta por vez ---------- */
  function faqAcordeao() {
    var perguntas = document.querySelectorAll(".faq details");

    for (var i = 0; i < perguntas.length; i++) {
      perguntas[i].addEventListener("toggle", function () {
        if (!this.open) return;
        for (var j = 0; j < perguntas.length; j++) {
          if (perguntas[j] !== this) perguntas[j].open = false;
        }
      });
    }
  }

  /* ---------- 3. Barra fixa de compra ----------
     Aparece depois que o botão do topo sai da tela e some enquanto
     a oferta ou o CTA final estão visíveis, para não repetir botão. */
  function barraInteligente() {
    var barra = document.getElementById("bar");
    if (!barra) return;

    if (!("IntersectionObserver" in window)) {
      barra.classList.add("bar--show");
      return;
    }

    var heroCta = document.querySelector(".hero .cta");
    var esconderEm = document.querySelectorAll(".offer-card, .final");
    var visiveis = 0;
    var passouHero = false;

    function atualizar() {
      barra.classList.toggle("bar--show", passouHero && visiveis === 0);
    }

    if (heroCta) {
      new IntersectionObserver(function (entradas) {
        var e = entradas[0];
        /* Só conta como "passou" quando o botão saiu por cima da tela */
        passouHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        atualizar();
      }).observe(heroCta);
    } else {
      passouHero = true;
    }

    var observador = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        entradas[i].target.__visivel = entradas[i].isIntersecting;
      }
      visiveis = 0;
      for (var k = 0; k < esconderEm.length; k++) {
        if (esconderEm[k].__visivel) visiveis++;
      }
      atualizar();
    }, { threshold: 0.15 });

    for (var j = 0; j < esconderEm.length; j++) observador.observe(esconderEm[j]);
  }

  /* ---------- 4. Tema claro / escuro ----------
     O tema inicial (escuro, identidade do e-book) é aplicado no <head>
     do index.html. Aqui só cuidamos do botão e de lembrar a escolha. */
  function botaoTema() {
    var botao = document.getElementById("tema");
    var raiz = document.documentElement;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!botao) return;

    function aplicar(tema) {
      var escuro = tema === "dark";
      raiz.setAttribute("data-theme", tema);
      botao.setAttribute("aria-pressed", escuro ? "true" : "false");
      botao.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
      if (meta) meta.setAttribute("content", escuro ? "#050507" : "#F4F4F7");
    }

    aplicar(raiz.getAttribute("data-theme") === "dark" ? "dark" : "light");

    botao.addEventListener("click", function () {
      var novo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
      aplicar(novo);
      try { localStorage.setItem("renda-extra:tema", novo); } catch (e) { /* aba anônima */ }
    });
  }

  /* ---------- 5. Cronômetro até o prazo real da oferta ---------- */
  function prazoOferta() {
    if (!PRAZO_OFERTA.ate) return;

    var fim = new Date(PRAZO_OFERTA.ate).getTime();
    if (isNaN(fim)) {
      console.warn("[Renda Extra] PRAZO_OFERTA.ate tem data inválida: " + PRAZO_OFERTA.ate);
      return;
    }
    if (fim <= Date.now()) return;

    var faixa = document.getElementById("prazo");
    var rotulo = document.querySelector("[data-prazo-texto]");
    var relogio = document.querySelector("[data-prazo-relogio]");
    var aviso = document.querySelector("[data-prazo-data]");
    if (!faixa || !relogio) return;

    function dois(n) { return (n < 10 ? "0" : "") + n; }

    var data = new Date(fim);
    if (rotulo) rotulo.textContent = PRAZO_OFERTA.texto;
    if (aviso) {
      aviso.textContent = "Preço válido até " + dois(data.getDate()) + "/" + dois(data.getMonth() + 1) +
        " às " + dois(data.getHours()) + "h" + dois(data.getMinutes());
      aviso.hidden = false;
    }
    faixa.hidden = false;

    var id = null;

    function tique() {
      var resta = fim - Date.now();
      if (resta <= 0) {
        faixa.hidden = true;
        if (aviso) aviso.hidden = true;
        clearInterval(id);
        return;
      }
      var s = Math.floor(resta / 1000);
      var dias = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var seg = s % 60;
      relogio.textContent = (dias > 0 ? dias + (dias === 1 ? " dia " : " dias ") : "") +
        dois(h) + ":" + dois(m) + ":" + dois(seg);
    }

    tique();
    id = setInterval(tique, 1000);
  }

  /* ---------- 6. Blocos aparecem suavemente ao rolar ----------
     Só roda se o <head> marcou a classe "js" (ou seja, o visitante não
     pediu menos movimento). Irmãos entram em cascata curta. */
  function revelarAoRolar() {
    var raiz = document.documentElement;
    if (!raiz.classList.contains("js")) return;

    var alvos = document.querySelectorAll(".reveal");

    function mostrarTudo() {
      for (var i = 0; i < alvos.length; i++) alvos[i].classList.add("in");
    }

    if (!("IntersectionObserver" in window)) { mostrarTudo(); return; }

    for (var i = 0; i < alvos.length; i++) {
      var irmaos = alvos[i].parentNode.children;
      var pos = Array.prototype.indexOf.call(irmaos, alvos[i]);
      alvos[i].style.setProperty("--d", Math.min(pos, 5) * 70 + "ms");
    }

    var observador = new IntersectionObserver(function (entradas) {
      for (var k = 0; k < entradas.length; k++) {
        if (!entradas[k].isIntersecting) continue;
        entradas[k].target.classList.add("in");
        observador.unobserve(entradas[k].target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (var m = 0; m < alvos.length; m++) observador.observe(alvos[m]);

    /* Links internos (#oferta etc.): mostra tudo para o destino não chegar vazio */
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) mostrarTudo();
    });
    if (location.hash) mostrarTudo();
  }

  /* ---------- 7. Visualizador das páginas do e-book ----------
     Cada prévia com data-lightbox abre a versão grande num <dialog>.
     A imagem grande só é baixada quando a pessoa toca na prévia. */
  function visualizador() {
    var dialogo = document.getElementById("lightbox");
    var botoes = document.querySelectorAll("[data-lightbox]");
    if (!dialogo || !botoes.length || typeof dialogo.showModal !== "function") return;

    var img = dialogo.querySelector("img");
    var legenda = dialogo.querySelector(".lightbox-cap");
    var origem = null;

    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener("click", function () {
        origem = this;
        img.src = this.getAttribute("data-lightbox");
        img.alt = this.querySelector("img").alt;
        legenda.textContent = this.getAttribute("data-caption") || "";
        dialogo.showModal();
      });
    }

    dialogo.querySelector(".lightbox-close").addEventListener("click", function () {
      dialogo.close();
    });
    /* Clique fora da imagem (no fundo escuro) também fecha */
    dialogo.addEventListener("click", function (e) {
      if (e.target === dialogo) dialogo.close();
    });
    dialogo.addEventListener("close", function () {
      if (origem) origem.focus();
    });
  }

  /* ---------- Inicialização ---------- */
  aplicarCheckout();
  faqAcordeao();
  barraInteligente();
  botaoTema();
  prazoOferta();
  revelarAoRolar();
  visualizador();
})();
