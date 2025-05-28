// Desplazamiento suave personalizado con compensación por el navbar fijo
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Lightbox para galería
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', function() {
    if (document.getElementById('gallery-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(34,48,38,0.82)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 2000;
    modal.innerHTML = '<img src="' + img.src + '" style="max-width:90vw;max-height:85vh;border-radius:1.2em;box-shadow:0 8px 42px #2228;"><span style=\'position:fixed;top:22px;right:32px;font-size:2.1em;color:#fff;cursor:pointer;font-family:sans-serif;\'>&times;</span>';
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
  });
});

// Validación de formulario de contacto
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    const status = document.getElementById('formStatus');
    if (!nombre || !email || !mensaje) {
      status.textContent = "Por favor, completa todos los campos.";
      status.style.color = "#d32f2f";
      return;
    }
    // Simulación de envío exitoso
    status.textContent = "¡Gracias! Pronto te responderemos.";
    status.style.color = "#1b7340";
    form.reset();
    setTimeout(() => { status.textContent = ""; }, 4000);
  });
}

// Menú activo según scroll
const sections = ['inicio','coleccion','nosotros','testimonios','contacto'];
const navLinks = Array.from(document.querySelectorAll(".navbar-links li a"));

window.addEventListener('scroll', () => {
  let current = 'inicio';
  for (let id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top - (document.querySelector('.navbar').offsetHeight + 12);
      if (top <= 0) current = id;
    }
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});