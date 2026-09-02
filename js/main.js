(function () {
  "use strict";

  var WA_FRANCISCO = "56940894579";
  var EMAIL_PRESUPUESTOS = "evolfrom@gmail.com";

  /* ---------- Header scroll + glassmorphism ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var mainNav = document.getElementById("mainNav");
  function closeNav() {
    mainNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
  hamburgerBtn.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    hamburgerBtn.classList.toggle("active", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  /* ---------- Fade-up on scroll ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".fade-up").forEach(function (el) { io.observe(el); });

  /* ---------- WhatsApp floating menu ---------- */
  var waFloatBtn = document.getElementById("waFloatBtn");
  var waFloatMenu = document.getElementById("waFloatMenu");
  waFloatBtn.addEventListener("click", function () {
    var isOpen = waFloatMenu.classList.toggle("open");
    waFloatBtn.setAttribute("aria-expanded", String(isOpen));
  });
  document.addEventListener("click", function (e) {
    if (!document.getElementById("waFloat").contains(e.target)) {
      waFloatMenu.classList.remove("open");
      waFloatBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Calculadora de m2 y presupuesto referencial ---------- */
  var PRECIOS_M2_CLP = {
    vivienda: { min: 550000, max: 750000, label: "Casa / vivienda" },
    ampliacion: { min: 600000, max: 800000, label: "Ampliación o segundo piso" },
    bodega: { min: 380000, max: 520000, label: "Bodega / nave industrial" },
    oficina: { min: 500000, max: 680000, label: "Oficina / faena" },
    otro: { min: 450000, max: 700000, label: "Proyecto" }
  };

  function formatCLP(n) {
    return "$" + Math.round(n).toLocaleString("es-CL");
  }

  var calcForm = document.getElementById("calcForm");
  var calcResult = document.getElementById("calcResult");
  var calcM2 = document.getElementById("calcM2");
  var calcMonto = document.getElementById("calcMonto");
  var calcWhatsapp = document.getElementById("calcWhatsapp");
  var calcEmail = document.getElementById("calcEmail");

  calcForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var ancho = parseFloat(document.getElementById("calcAncho").value) || 0;
    var largo = parseFloat(document.getElementById("calcLargo").value) || 0;
    var pisos = parseInt(document.getElementById("calcPisos").value, 10) || 1;
    var tipoKey = document.getElementById("calcTipo").value;
    var tipo = PRECIOS_M2_CLP[tipoKey];

    var m2 = ancho * largo * pisos;
    if (m2 <= 0) return;

    var montoMin = m2 * tipo.min;
    var montoMax = m2 * tipo.max;

    calcM2.textContent = m2.toLocaleString("es-CL") + " m²";
    calcMonto.textContent = formatCLP(montoMin) + " - " + formatCLP(montoMax);
    calcResult.hidden = false;
    calcResult.scrollIntoView({ behavior: "smooth", block: "nearest" });

    var resumen = tipo.label + ", " + ancho + "m x " + largo + "m x " + pisos +
      " piso(s) = " + m2.toLocaleString("es-CL") + " m². Presupuesto referencial: " +
      formatCLP(montoMin) + " - " + formatCLP(montoMax) + ".";

    var waMsg = encodeURIComponent(
      "Hola Evolfrom, hice la calculadora de proyecto: " + resumen + " Quiero un presupuesto detallado."
    );
    calcWhatsapp.href = "https://wa.me/" + WA_FRANCISCO + "?text=" + waMsg;

    var subject = encodeURIComponent("Solicitud de presupuesto - Evolfrom");
    var body = encodeURIComponent(
      "Hola,\n\nHice la calculadora del sitio web y quiero un presupuesto detallado.\n\n" +
      "Tipo de proyecto: " + tipo.label + "\n" +
      "Ancho: " + ancho + " m\n" +
      "Largo: " + largo + " m\n" +
      "Pisos: " + pisos + "\n" +
      "Superficie estimada: " + m2.toLocaleString("es-CL") + " m²\n" +
      "Presupuesto referencial: " + formatCLP(montoMin) + " - " + formatCLP(montoMax) + "\n\n" +
      "Quedo atento/a.\n"
    );
    calcEmail.href = "mailto:" + EMAIL_PRESUPUESTOS + "?subject=" + subject + "&body=" + body;
  });

  /* ---------- Formulario de contacto -> WhatsApp ---------- */
  var contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = document.getElementById("cNombre").value.trim();
    var comuna = document.getElementById("cComuna").value.trim();
    var mensaje = document.getElementById("cMensaje").value.trim();

    var texto = "Hola Evolfrom, soy " + nombre +
      (comuna ? " (proyecto en " + comuna + ")" : "") +
      ". " + mensaje;

    var url = "https://wa.me/" + WA_FRANCISCO + "?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener");
  });
})();
