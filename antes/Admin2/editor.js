// Barra de edición de texto
let lastEditable = null;
document.querySelectorAll('.editable').forEach(el => {
  el.addEventListener('focus', function () {
    lastEditable = this;
    let style = window.getComputedStyle(this);
    document.getElementById('font-family').value = getFontName(style.fontFamily);
    let px = parseInt(style.fontSize,10);
    document.getElementById('font-size').value = px;
    document.getElementById('font-color').value = rgb2hex(style.color);
    document.getElementById('bold-btn').classList.toggle('selected', style.fontWeight >= 600 || style.fontWeight === 'bold');
    document.getElementById('italic-btn').classList.toggle('selected', style.fontStyle === 'italic');
    document.getElementById('underline-btn').classList.toggle('selected', style.textDecorationLine.includes('underline'));
  });
});
// Fuente
document.getElementById('font-family').onchange = function () {
  if (lastEditable) lastEditable.style.fontFamily = `'${this.value}', sans-serif`;
};
// Tamaño
document.getElementById('font-size').oninput = function () {
  if (lastEditable) lastEditable.style.fontSize = this.value + "px";
};
// Color
document.getElementById('font-color').oninput = function () {
  if (lastEditable) lastEditable.style.color = this.value;
};
// Negrita
document.getElementById('bold-btn').onclick = function () {
  if (lastEditable) document.execCommand('bold', false, null);
};
// Cursiva
document.getElementById('italic-btn').onclick = function () {
  if (lastEditable) document.execCommand('italic', false, null);
};
// Subrayado
document.getElementById('underline-btn').onclick = function () {
  if (lastEditable) document.execCommand('underline', false, null);
};
function rgb2hex(rgb) {
  if (!rgb) return "#25352F";
  if (rgb.startsWith("#")) return rgb;
  let nums = rgb.match(/\d+/g);
  if (!nums) return "#25352F";
  return "#" + nums.slice(0,3).map(x=>('0'+parseInt(x).toString(16)).slice(-2)).join('');
}
function getFontName(fontFamily) {
  if (!fontFamily) return "Montserrat";
  let f = fontFamily.split(',')[0].replace(/['"]/g, "").trim();
  return f;
}

// Cambiar imagen central al hacer clic en el círculo grande
document.getElementById('hero-img-wrap').onclick = function() {
  document.getElementById('hero-img-file').click();
};
document.getElementById('hero-img-file').onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    document.getElementById('hero-img').src = evt.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};

// Cambiar logo pequeño al hacer clic
document.getElementById('logo-img').onclick = function() {
  document.getElementById('logo-img-file').click();
};
document.getElementById('logo-img-file').onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    document.getElementById('logo-img').src = evt.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};

// Galería edición
function attachGalleryImgListeners(wrap) {
  const input = wrap.querySelector('.img-edit-btn input[type="file"]');
  const img = wrap.querySelector('img');
  if (input && img) {
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    };
  }
  const delBtn = wrap.querySelector('.del-img-btn');
  if (delBtn) {
    delBtn.onclick = function() {
      wrap.remove();
    };
  }
}
function initGalleryEditing() {
  const addBtn = document.getElementById('add-gallery-img-btn');
  const fileInput = document.getElementById('add-gallery-img-input');
  if (addBtn && fileInput) {
    addBtn.onclick = function() {
      fileInput.click();
    };
    fileInput.onchange = function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = evt => {
          let newDiv = document.createElement('div');
          newDiv.className = 'gallery-img-wrap';
          newDiv.innerHTML = `
            <span class="img-edit-btn" title="Cambiar imagen">
              🖉
              <input type="file" accept="image/*">
            </span>
            <img src="${evt.target.result}" alt="Nueva imagen">
            <span class="del-img-btn" title="Eliminar imagen">🗑️</span>
          `;
          document.getElementById('gallery').appendChild(newDiv);
          attachGalleryImgListeners(newDiv);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    };
  }
  document.querySelectorAll('.gallery-img-wrap').forEach(attachGalleryImgListeners);
}
window.addEventListener('DOMContentLoaded', function() {
  initGalleryEditing();
});

// Fondo: color sólido
document.getElementById('bg-color-picker').oninput = function() {
  document.body.style.background = this.value;
  document.body.dataset.bgtype = "solid";
};
// Fondo: degradé
document.getElementById('bg-gradient-btn').onclick = function() {
  document.body.style.background = "linear-gradient(120deg, #E6F2ED 0%, #B7D8C4 100%)";
  document.body.dataset.bgtype = "gradient";
};

// Guardar: HTML limpio SOLO CON LA VISTA FINAL
document.getElementById('save-html-btn').onclick = function() {
  let doc = document.documentElement.cloneNode(true);

  // Limpieza de edición
  doc.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));
  doc.querySelectorAll('.img-edit-btn, .del-img-btn, .add-img-btn, .save-btn, .nav-edit-btn, input[type="file"], #editor-bar, .add-text-btn, .close-btn').forEach(el=>el.remove());
  doc.querySelectorAll('[onclick]').forEach(e=>e.removeAttribute('onclick'));
  doc.querySelectorAll('script').forEach(e=>e.remove());

  // Dejar el fondo igual que el usuario eligió
  let bg = document.body.style.background;
  if (bg) {
    doc.body.setAttribute('style', 'background: ' + bg + '; color: #25352F; margin: 0;');
  }

  // Descarga el HTML limpio y definitivo
  const html = '<!DOCTYPE html>\n' + doc.outerHTML;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], {type: 'text/html'}));
  a.download = 'index.html';
  a.click();
};

// Testimonios
document.getElementById('add-testimonial-btn').onclick = function() {
  let bq = document.createElement('blockquote');
  bq.className = 'editable';
  bq.contentEditable = "true";
  bq.innerHTML = `“Nuevo testimonio...” <span class="editable" contenteditable="true">— Nombre</span>`;
  document.getElementById('testimonios-list').appendChild(bq);
  bq.focus();
};