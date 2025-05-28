// Carga la galería desde data.json
fetch('data.json')
  .then(res => res.json())
  .then(plants => {
    const gallery = document.getElementById('gallery');
    plants.forEach(plant => {
      const card = document.createElement('div');
      card.className = 'plant-card';
      card.innerHTML = `
        <img class="plant-image" src="${plant.image}" alt="${plant.name}">
        <div class="plant-info">
          <div class="plant-name">${plant.name}</div>
          <div class="plant-description">${plant.description}</div>
        </div>
      `;
      gallery.appendChild(card);
    });
  });