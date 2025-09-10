// combocontroller.js
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.producto').forEach(card => {
    const guisosMax = getGuisosMax(card.dataset.nombre);
    const guisoCheckboxes = card.querySelectorAll('.combo-guiso');

    // Control de guisos seleccionados
    guisoCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const seleccionados = card.querySelectorAll('.combo-guiso:checked');
        if (seleccionados.length > guisosMax) {
          cb.checked = false;
          alert(`Solo puedes seleccionar ${guisosMax} guiso(s) para ${card.dataset.nombre}`);
        }
        guardarSeleccion(card);
        actualizarResumen();
      });
    });

    // Control de base (arroz o espagueti)
    const baseSelect = card.querySelector('.combo-base');
    if (baseSelect) {
      baseSelect.addEventListener('change', () => {
        guardarSeleccion(card);
        actualizarResumen();
      });
    }
  });

  // Cada vez que cambie cantidad de un producto (por scriptchinese.js)
  document.querySelectorAll('.sumar, .restar').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        document.querySelectorAll('.producto').forEach(c => guardarSeleccion(c));
        actualizarResumen();
      }, 100); // esperamos a que se actualice cantidad
    });
  });
});

// =========================
// Funciones de soporte
// =========================
function getGuisosMax(comboNombre) {
  if (comboNombre === "Combo 1") return 1;
  if (comboNombre === "Combo 2") return 2;
  if (comboNombre === "Combo 3") return 3;
  return 0;
}

function guardarSeleccion(card) {
  const base = card.querySelector('.combo-base')?.value || "";
  const guisos = Array.from(card.querySelectorAll('.combo-guiso:checked'))
    .map(el => el.value)
    .join(", ");

  // Guardamos en dataset lo que eligió
  card.dataset.seleccionResumen = [base, guisos].filter(Boolean).join(" | ");
}

function actualizarResumen() {
  const listaResumen = document.getElementById("lista-resumen");
  const totalResumen = document.getElementById("total-resumen");
  let total = 0;
  listaResumen.innerHTML = "";

  document.querySelectorAll('.producto').forEach(card => {
    const nombre = card.dataset.nombre;
    const precio = parseInt(card.dataset.precio);
    const cantidad = parseInt(card.querySelector('.cantidad').textContent);

    if (cantidad > 0) {
      let subtotal = cantidad * precio;
      let itemNombre = nombre;

      // Agregar la base y guisos si existen
      if (card.dataset.seleccionResumen) {
        itemNombre += ` (${card.dataset.seleccionResumen})`;
      }

      const li = document.createElement("li");
      li.textContent = `${cantidad} x ${itemNombre} ($${precio} c/u) = $${subtotal}`;
      listaResumen.appendChild(li);
      total += subtotal;
    }
  });

  totalResumen.textContent = total;
}