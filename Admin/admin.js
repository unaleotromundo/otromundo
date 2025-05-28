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
}

document.getElementById('plant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let imageSrc = '';
  const repoSelect = document.getElementById('repo-image-list');
  if (repoSelect.style.display !== "none" && repoSelect.value) {
    imageSrc = repoSelect.value;
  } else {
    alert('Debes seleccionar una imagen del repositorio.');
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
  repoSelect.selectedIndex = 0;
});

document.getElementById('repo-image-btn').addEventListener('click', async function() {
  const select = document.getElementById('repo-image-list');
  if (select.options.length === 0) {
    const repoURL = 'https://api.github.com/repos/aleotromundo/tu-repo/contents/imagenes';
    const res = await fetch(repoURL);
    const files = await res.json();
    select.innerHTML = '';
    files.filter(f => f.type === "file" && /\.(jpe?g|png|gif|webp)$/i.test(f.name)).forEach(f => {
      const option = document.createElement('option');
      option.value = f.download_url;
      option.textContent = f.name;
      select.appendChild(option);
    });
  }
  select.style.display = select.style.display === "none" ? "inline" : "none";
});

document.getElementById('repo-image-list').addEventListener('change', function() {
  const imgSrc = this.value;
  document.getElementById('preview').innerHTML = `
    <div class="preview-card">
      <img src="${imgSrc}" alt="">
      <div class="preview-info">
        <div class="preview-name">${document.getElementById('plant-name').value || ''}</div>
        <div class="preview-description">${document.getElementById('plant-description').value || ''}</div>
      </div>
    </div>
  `;
});

// Nombre y descripción: actualiza preview si hay imagen seleccionada
['plant-name', 'plant-description'].forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    const repoSelect = document.getElementById('repo-image-list');
    const imgSrc = (repoSelect.style.display !== "none" && repoSelect.value) ? repoSelect.value : '';
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