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

// ---- IA para sugerir nombre y descripción de la planta ----
document.getElementById('suggest-name-btn').addEventListener('click', async function() {
  const fileInput = document.getElementById('plant-file');
  const urlInput = document.getElementById('plant-image-url');
  let imageBase64 = null;

  if (fileInput.files && fileInput.files[0]) {
    // Convertir imagen local a base64
    imageBase64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        // Quitar el prefijo data:image/...;base64,
        const base64 = e.target.result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(fileInput.files[0]);
    });
  } else if (urlInput.value.trim() !== '') {
    // Descargar imagen desde URL y convertir a base64
    try {
      const response = await fetch(urlInput.value.trim());
      const blob = await response.blob();
      imageBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          const base64 = e.target.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      alert('No se pudo descargar la imagen de la URL.');
      return;
    }
  } else {
    alert('Primero selecciona una imagen (archivo o URL).');
    return;
  }

  if (!imageBase64) {
    alert('No se pudo cargar la imagen.');
    return;
  }

  // --- Llama a la API de Plant.id ---
  const btn = document.getElementById('suggest-name-btn');
  const oldBtn = btn.innerText;
  btn.innerText = "🤖...";

  try {
    const res = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "7ZaHtxmUPEQjKnesvDLHFmJulKSerxpuGLs8ZDuS29p6yG1kl0" // ← PON AQUÍ TU API KEY DE PLANT.ID
      },
      body: JSON.stringify({
        images: [imageBase64]
      })
    });
    const data = await res.json();
    if (data.suggestions && data.suggestions.length > 0) {
      // Preferir español si está disponible
      let nombre = "";
      let descripcion = "";
      const suggestion = data.suggestions[0];

      // Buscar nombre común en español
      if (suggestion.plant_details && suggestion.plant_details.common_names) {
        // Busca nombre común en español
        let foundES = suggestion.plant_details.common_names.find(n => /[áéíóúñü]/i.test(n) || n.match(/\bde\b|\bdel\b|\bla\b|\bel\b|\blos\b|\blas\b/));
        if (foundES) nombre = foundES;
        else nombre = suggestion.plant_name;
      } else {
        nombre = suggestion.plant_name;
      }

      // Buscar descripción en español
      if (
        suggestion.plant_details &&
        suggestion.plant_details.wiki_description &&
        suggestion.plant_details.wiki_description.value
      ) {
        // Si hay varios idiomas, buscar español
        if (suggestion.plant_details.wiki_description.language === "es") {
          descripcion = suggestion.plant_details.wiki_description.value;
        } else if (suggestion.plant_details.wiki_description.value_es) {
          descripcion = suggestion.plant_details.wiki_description.value_es;
        } else {
          descripcion = suggestion.plant_details.wiki_description.value;
        }
      } else {
        descripcion = "Sin descripción disponible.";
      }
      document.getElementById('plant-name').value = nombre;
      document.getElementById('plant-description').value = descripcion;
    } else {
      alert('No se pudo identificar la planta.');
    }
  } catch (err) {
    alert('Error al contactar la IA de Plant.id');
  }
  btn.innerText = oldBtn;
});
// ... resto de tu código igual ...

// ---- IA para sugerir nombre y descripción de la planta ----
document.getElementById('suggest-name-btn').addEventListener('click', async function() {
  const fileInput = document.getElementById('plant-file');
  const urlInput = document.getElementById('plant-image-url');
  let imageBase64 = null;

  if (fileInput.files && fileInput.files[0]) {
    imageBase64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = e.target.result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(fileInput.files[0]);
    });
  } else if (urlInput.value.trim() !== '') {
    try {
      const response = await fetch(urlInput.value.trim());
      const blob = await response.blob();
      imageBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          const base64 = e.target.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      alert('No se pudo descargar la imagen de la URL.');
      return;
    }
  } else {
    alert('Primero selecciona una imagen (archivo o URL).');
    return;
  }

  if (!imageBase64) {
    alert('No se pudo cargar la imagen.');
    return;
  }

  const btn = document.getElementById('suggest-name-btn');
  const oldBtn = btn.innerText;
  btn.innerText = "🤖...";

  try {
    const res = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "7ZaHtxmUPEQjKnesvDLHFmJulKSerxpuGLs8ZDuS29p6yG1kl0" // <-- pon aquí tu clave de Plant.id
      },
      body: JSON.stringify({
        images: [imageBase64]
      })
    });
    const data = await res.json();
    if (data.suggestions && data.suggestions.length > 0) {
      const suggestion = data.suggestions[0];
      let nombre = suggestion.plant_name;
      if (
        suggestion.plant_details &&
        suggestion.plant_details.common_names &&
        suggestion.plant_details.common_names.length > 0
      ) {
        nombre = suggestion.plant_details.common_names[0];
      }
      document.getElementById('plant-name').value = nombre;

      // Ahora busca la descripción en Google automáticamente
      // OJO: aquí solo muestro la integración, necesitarás un backend/proxy para consultas reales o usar fetch a un endpoint tuyo
      // Aquí solo muestro cómo llamar a Bing Search API o similar

      // Ejemplo simulado:
      const descripcion = await buscarDescripcionPlanta(nombre);
      document.getElementById('plant-description').value = descripcion;
    } else {
      alert('No se pudo identificar la planta.');
    }
  } catch (err) {
    alert('Error al contactar la IA de Plant.id');
  }
  btn.innerText = oldBtn;
});

// Función que busca la descripción en Google (simulada, deberás implementarla con tu backend o Bing Search API)
async function buscarDescripcionPlanta(nombrePlanta) {
  // Aquí deberías hacer un fetch a tu backend o servicio de búsqueda
  // Este ejemplo usa una descripción fija para Monstera deliciosa
  if (nombrePlanta.toLowerCase().includes("monstera")) {
    return "La Monstera deliciosa es una planta trepadora perenne de origen tropical, reconocida por sus grandes hojas con perforaciones, ideal para interiores luminosos.";
  }
  // ... puedes agregar más ejemplos o integrar un servicio real ...
  return "Planta de origen desconocido.";
}