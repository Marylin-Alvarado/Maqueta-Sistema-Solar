// Seleccionar todos los planetas
const planets = document.querySelectorAll('.planet');

let selectedPlanet = null;
let offsetX = 0;
let offsetY = 0;
let speedMultiplier = 1;
let isMoving = true; // Reactivar animación automática

// Función para ajustar la velocidad de rotación de las órbitas
function setOrbitSpeed(multiplier) {
  const orbits = document.querySelectorAll('.orbit');
  orbits.forEach(orbit => {
    if (orbit.classList.contains('mercury')) orbit.style.animationDuration = `${4 / multiplier}s`;
    if (orbit.classList.contains('venus')) orbit.style.animationDuration = `${6 / multiplier}s`;
    if (orbit.classList.contains('earth')) orbit.style.animationDuration = `${8 / multiplier}s`;
    if (orbit.classList.contains('mars')) orbit.style.animationDuration = `${10 / multiplier}s`;
    if (orbit.classList.contains('jupiter')) orbit.style.animationDuration = `${14 / multiplier}s`;
    if (orbit.classList.contains('saturn')) orbit.style.animationDuration = `${18 / multiplier}s`;
    if (orbit.classList.contains('uranus')) orbit.style.animationDuration = `${22 / multiplier}s`;
    if (orbit.classList.contains('neptune')) orbit.style.animationDuration = `${26 / multiplier}s`;
    if (orbit.classList.contains('moon')) orbit.style.animationDuration = `${2 / multiplier}s`;
  });
}

// Restaurar el control de velocidad
function createSpeedSlider() {
  if (!document.getElementById('speed-slider')) {
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.style.position = 'fixed';
    controls.style.top = '30px';
    controls.style.right = '30px';
    controls.style.zIndex = '2000';
    controls.style.background = 'rgba(0,0,0,0.7)';
    controls.style.padding = '10px 20px';
    controls.style.borderRadius = '10px';
    controls.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    controls.innerHTML = `
      <label for="speed-slider" style="color:white;">Velocidad:</label>
      <input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="1">
    `;
    document.body.appendChild(controls);
    document.getElementById('speed-slider').addEventListener('input', (e) => {
      speedMultiplier = parseFloat(e.target.value);
      setOrbitSpeed(speedMultiplier);
    });
  }
}
createSpeedSlider();
setOrbitSpeed(1);

// Función para detectar colisiones
function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

// Función para manejar la explosión con animación visual
function explode(planet) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.position = 'absolute';
  const rect = planet.getBoundingClientRect();
  explosion.style.left = `${rect.left + window.scrollX}px`;
  explosion.style.top = `${rect.top + window.scrollY}px`;
  document.body.appendChild(explosion);

  // Esperar a que termine la animación antes de ocultar el planeta
  setTimeout(() => {
    explosion.remove();
    planet.style.display = 'none';
  }, 1000);
}

// Animación de movimiento automática
function animate() {
  if (isMoving) {
    planets.forEach((planet) => {
      if (planet.style.display !== 'none') {
        const orbit = planet.parentElement;
        const orbitRect = orbit.getBoundingClientRect();
        const planetRect = planet.getBoundingClientRect();
        const newLeft = parseFloat(planet.style.left || 0) + (Math.random() * speedMultiplier);
        const newTop = parseFloat(planet.style.top || 0) + (Math.random() * speedMultiplier);
        if (newLeft >= 0 && newLeft <= orbitRect.width - planetRect.width) {
          planet.style.left = `${newLeft}px`;
        }
        if (newTop >= 0 && newTop <= orbitRect.height - planetRect.height) {
          planet.style.top = `${newTop}px`;
        }
      }
    });
  }
  requestAnimationFrame(animate);
}
animate();

// Ajustar la lógica para que los planetas no desaparezcan al moverlos y solo exploten al colisionar
planets.forEach((planet) => {
  planet.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Evitar que el navegador interprete el evento como desplazamiento de la página
    selectedPlanet = planet;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    planet.style.zIndex = 1000; // Traer al frente
  });
});

document.addEventListener('mousemove', (e) => {
  if (selectedPlanet) {
    e.preventDefault(); // Evitar el desplazamiento de la página
    const parentRect = selectedPlanet.parentElement.getBoundingClientRect();
    selectedPlanet.style.position = 'absolute';
    selectedPlanet.style.left = `${e.clientX - parentRect.left - offsetX}px`;
    selectedPlanet.style.top = `${e.clientY - parentRect.top - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  if (selectedPlanet) {
    // Verificar colisiones después de soltar el planeta
    planets.forEach((otherPlanet) => {
      if (selectedPlanet !== otherPlanet && isColliding(selectedPlanet, otherPlanet)) {
        explode(selectedPlanet);
        explode(otherPlanet);
      }
    });
    selectedPlanet.style.zIndex = '';
    selectedPlanet = null; // Liberar el planeta seleccionado
  }
});