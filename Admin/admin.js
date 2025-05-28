let plants = [];

function updateJSON() {
  document.getElementById('json-output').value = JSON.stringify(plants, null, 2);
}

function updatePreview() {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  plants.forEach(plant => {
    const div = document.createElement('div');
    div.className = 'preview-card';
    div.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}">
      <div class="preview-info">
        <div class="preview-name">${plant.name}</div>
        <div class="preview-description">${plant.description}</div>
      </div>
    `;
    preview.appendChild(div);
  });
}

function clearForm() {
  document.getElementById('plant-form').reset();
  document.getElementById('plant-image-url').value = '';
  document.getElementById('plant-file').value = '';
}

document.getElementById('plant-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('plant-file');
  const urlInput = document.getElementById('plant-image-url');
  let imageSrc = '';

  // Si se seleccionó un archivo local, lo usamos como DataURL
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    imageSrc = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  } else if (urlInput.value.trim() !== '') {
    // Si hay URL, la usamos
    imageSrc = urlInput.value.trim();
  } else {
    alert('Debes seleccionar una imagen (archivo o URL)');
    return;
  }

  const plant = {
    image: imageSrc,
    name: document.getElementById('plant-name').value,
    description: document.getElementById('plant-description').value,
  };
  plants.push(plant);
  updateJSON();
  updatePreview();
  clearForm();
});

// Permite previsualizar una imagen al seleccionarla antes de agregarla
document.getElementById('plant-file').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  document.getElementById('plant-image-url').value = '';
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('preview').innerHTML = `
      <div class="preview-card">
        <img src="${e.target.result}" alt="">
        <div class="preview-info">
          <div class="preview-name">${document.getElementById('plant-name').value || ''}</div>
          <div class="preview-description">${document.getElementById('plant-description').value || ''}</div>
        </div>
      </div>
    `;
  };
  reader.readAsDataURL(file);
});

// Permite previsualizar una imagen desde URL antes de agregarla
document.getElementById('plant-image-url').addEventListener('input', function() {
  if (this.value.trim() !== '') {
    document.getElementById('plant-file').value = '';
    document.getElementById('preview').innerHTML = `
      <div class="preview-card">
        <img src="${this.value.trim()}" alt="">
        <div class="preview-info">
          <div class="preview-name">${document.getElementById('plant-name').value || ''}</div>
          <div class="preview-description">${document.getElementById('plant-description').value || ''}</div>
        </div>
      </div>
    `;
  }
});

// Al cambiar nombre o descripción, actualiza la vista previa si hay imagen seleccionada
['plant-name', 'plant-description'].forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    const imgSrc =
      document.getElementById('plant-image-url').value.trim() ||
      (document.getElementById('plant-file').files[0]
        ? URL.createObjectURL(document.getElementById('plant-file').files[0])
        : '');
    if (imgSrc) {
      document.getElementById('preview').innerHTML = `
        <div class="preview-card">
          <img src="${imgSrc}" alt="">
          <div class="preview-info">
            <div class="preview-name">${document.getElementById('plant-name').value || ''}</div>
            <div class="preview-description">${document.getElementById('plant-description').value || ''}</div>
          </div>
        </div>
      `;
    }
  });
});

document.getElementById('update-gallery-btn').addEventListener('click', function() {
  alert('¡Copia el JSON y reemplaza tu archivo data.json en el repositorio para actualizar la galería!');
});