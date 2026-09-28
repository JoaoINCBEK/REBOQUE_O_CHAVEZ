/* =========================================================
   CONTATO: edite aqui. Números só com dígitos, com DDD.
   Ex.: whatsapp: "5511999999999" (55 + DDD + número)
        telefone: "11999999999"
   Campos vazios mantêm o texto provisório da página.
   ========================================================= */
const CONTATO = {
  whatsapp: "5585988154053",
  telefone: "85988154053",
  mensagemWhatsapp: "Olá! Preciso de um reboque. Minha localização é:",
  endereco: "Fortaleza, CE",
  horario: "",
  cnpj: ""
};

(function () {
  "use strict";

  const formatPhone = (digits) => {
    const d = digits.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return digits;
  };

  // Links reais só quando o número existir; sem número, o botão leva à seção de contato.
  const links = {
    whatsapp: CONTATO.whatsapp
      ? `https://wa.me/${CONTATO.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(CONTATO.mensagemWhatsapp)}`
      : null,
    tel: CONTATO.telefone ? `tel:+55${CONTATO.telefone.replace(/\D/g, "")}` : null
  };

  document.querySelectorAll("[data-link]").forEach((el) => {
    const href = links[el.dataset.link];
    if (!href) return;
    el.href = href;
    if (el.dataset.link === "whatsapp") {
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  const values = {
    whatsapp: CONTATO.whatsapp && formatPhone(CONTATO.whatsapp),
    telefone: CONTATO.telefone && formatPhone(CONTATO.telefone),
    endereco: CONTATO.endereco,
    horario: CONTATO.horario,
    cnpj: CONTATO.cnpj && `CNPJ ${CONTATO.cnpj}`
  };
  document.querySelectorAll("[data-contato]").forEach((el) => {
    const v = values[el.dataset.contato];
    if (v) el.textContent = v;
  });

  const year = document.querySelector("[data-ano]");
  if (year) year.textContent = new Date().getFullYear();

  // Header: reduz e ganha fundo ao rolar
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const bar = document.querySelector(".mobile-bar");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    if (bar && hero) {
      const show = y > hero.offsetHeight - 80;
      bar.classList.toggle("is-visible", show);
      document.body.classList.toggle("has-mobile-bar", show);
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // Álbum: botões e arrastar com o mouse (no celular o arrasto é nativo)
  const track = document.getElementById("album");
  if (track) {
    const buttons = document.querySelectorAll(".gallery-btn");
    const step = () => {
      const item = track.querySelector("li");
      return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
    };
    const updateButtons = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      buttons.forEach((b) => {
        b.disabled = b.dataset.dir === "-1" ? track.scrollLeft <= 2 : track.scrollLeft >= max;
      });
    };
    buttons.forEach((b) => b.addEventListener("click", () => {
      track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: "smooth" });
    }));
    track.addEventListener("scroll", () => requestAnimationFrame(updateButtons), { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();

    let startX = 0, startScroll = 0, dragging = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) track.classList.add("is-dragging");
      track.scrollLeft = startScroll - dx;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      const left = track.scrollLeft;
      track.classList.remove("is-dragging");
      // encaixa na foto mais próxima depois de soltar
      track.scrollLeft = left;
      track.scrollTo({ left: Math.round(left / step()) * step(), behavior: "smooth" });
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
  }

})();
