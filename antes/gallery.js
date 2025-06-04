// gallery.js SOLO el JS para generar la galería con marcos individuales

const plantas = [
  {
    nombre: "Echeveria Blue Rose",
    desc: "Rosa de hojas que susurra secretos ancestrales a la luz del amanecer.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=500&q=80"
  },
  {
    nombre: "Haworthia Zebra",
    desc: "Custodia del misterio en la penumbra, con rayas que evocan los velos de la noche.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=500&q=80"
  },
  {
    nombre: "Sedum Golden Glow",
    desc: "Centelleo dorado en el crepúsculo, promesa de eternidad y abundancia.",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=400&h=500&q=80"
  },
  {
    nombre: "Aloe Vera",
    desc: "Sanadora ancestral, guardiana del verde secreto y la esperanza.",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=500&q=80"
  },
  {
    nombre: "Graptopetalum",
    desc: "Estrella helada, su simetría desafía el tiempo y la lógica.",
    img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=facearea&w=400&h=500&q=80"
  },
  {
    nombre: "Crassula Ovata",
    desc: "Árbol de jade, fortuna y destino entrelazados en cada hoja.",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=500&q=80"
  }
];

function renderGaleriaMarcos() {
  const galeria = document.getElementById("cuadros-galeria");
  galeria.innerHTML = "";
  plantas.forEach((planta) => {
    const marco = document.createElement("div");
    marco.className = "cuadro-marco-ind";
    marco.innerHTML = `
      <div class="marco-ornamental">
        <img src="${planta.img}" alt="${planta.nombre}" class="foto-planta-ind"
          data-nombre="${planta.nombre}" data-desc="${planta.desc}">
      </div>
    `;
    marco.onmouseenter = function() {
      mostrarInfoPlanta(planta.nombre, planta.desc);
    };
    marco.onmouseleave = function() {
      ocultarInfoPlanta();
    };
    galeria.appendChild(marco);
  });
}

function mostrarInfoPlanta(nombre, desc) {
  const info = document.getElementById('info-planta');
  info.innerHTML = `<div>${nombre}</div><div class="desc">${desc}</div>`;
  info.classList.add('visible');
}
function ocultarInfoPlanta() {
  document.getElementById('info-planta').classList.remove('visible');
}

document.addEventListener("DOMContentLoaded", renderGaleriaMarcos);