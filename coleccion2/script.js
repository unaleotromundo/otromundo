document.addEventListener('DOMContentLoaded', () => {
    const galleryFrames = document.querySelectorAll('.frame');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeButton = document.querySelector('.close-button');
    const body = document.body;

    const welcomeModal = document.getElementById('welcomeModal'); 
    const closeWelcomeButton = document.querySelector('.close-welcome-button'); 

    const floatingCactusButton = document.getElementById('floatingCactusButton'); // Nuevo: Referencia al botón flotante
    const collection1URL = 'https://contralamaquina.github.io/otromundo/'; // *** CAMBIA ESTA URL a la de tu Colección 1 ***

    // --- Lógica del Modal de Bienvenida ---
    setTimeout(() => {
        welcomeModal.classList.add('active');
        body.classList.add('modal-active'); 
    }, 100); 

    closeWelcomeButton.addEventListener('click', () => {
        welcomeModal.classList.remove('active');
        body.classList.remove('modal-active'); 
    });

    welcomeModal.addEventListener('click', (event) => {
        if (event.target === welcomeModal) {
            welcomeModal.classList.remove('active');
            body.classList.remove('modal-active');
        }
    });

    // --- Lógica de la Galería (Lightbox y Hover) ---
    galleryFrames.forEach(frame => {
        const fullSizeSrc = frame.dataset.fullsizeSrc;
        const hoverInfoImg = frame.querySelector('.hover-info .hover-image');

        if (hoverInfoImg && fullSizeSrc) {
            frame.addEventListener('mouseenter', () => {
                if (!body.classList.contains('modal-active')) { 
                    hoverInfoImg.src = fullSizeSrc;
                }
            });
        }

        frame.addEventListener('click', () => {
            if (!welcomeModal.classList.contains('active')) { // Solo si el modal de bienvenida NO está activo
                if (fullSizeSrc) {
                    lightboxImg.src = fullSizeSrc;
                    lightbox.classList.add('active');
                    body.classList.add('modal-active'); 
                }
            }
        });
    });

    closeButton.addEventListener('click', () => {
        lightbox.classList.remove('active');
        body.classList.remove('modal-active'); 
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.classList.remove('active');
            body.classList.remove('modal-active');
        }
    });

    // --- Lógica del Botón Flotante ---
    if (floatingCactusButton) { // Asegurarse de que el botón exista
        floatingCactusButton.addEventListener('click', () => {
            // Solo redirige si ningún modal está activo
            if (!body.classList.contains('modal-active')) {
                window.location.href = collection1URL; // Redirecciona a la URL
            }
        });
    }

    // --- Cierre con Escape (para todos los modales) ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (welcomeModal.classList.contains('active')) {
                welcomeModal.classList.remove('active');
                body.classList.remove('modal-active');
            } else if (lightbox.classList.contains('active')) { 
                lightbox.classList.remove('active');
                body.classList.remove('modal-active');
            }
        }
    });
});