document.querySelectorAll('.producto').forEach(card => {
  const btnSumar = card.querySelector('.sumar');
  const btnRestar = card.querySelector('.restar');
  const cantidadEl = card.querySelector('.cantidad');

  btnSumar.addEventListener('click', () => {
    let cantidad = parseInt(cantidadEl.textContent);
    cantidad++;
    cantidadEl.textContent = cantidad;
    actualizarResumen();
  });

  btnRestar.addEventListener('click', () => {
    let cantidad = parseInt(cantidadEl.textContent);
    if (cantidad > 0) {
      cantidad--;
      cantidadEl.textContent = cantidad;
      actualizarResumen();
    }
  });
});

function actualizarResumen() {
  const productos = document.querySelectorAll('.producto');
  const listaResumen = document.getElementById('listaResumen');
  const totalResumen = document.getElementById('totalResumen');
  const resumenPedido = document.getElementById('resumenPedido');

  let total = 0;
  let hayProductos = false;
  listaResumen.innerHTML = "";

  productos.forEach(card => {
    const nombre = card.dataset.nombre;
    const precio = parseInt(card.dataset.precio);
    const cantidad = parseInt(card.querySelector('.cantidad').textContent);

    if (cantidad > 0) {
  let subtotal = cantidad * precio;

  // 🔹 Base seleccionada
  const base = card.querySelector('.combo-base')?.value || "";

  // 🔹 Guisos seleccionados
  const guisos = Array.from(card.querySelectorAll('.combo-guiso:checked'))
    .map(el => el.value)
    .join(", ");

  // 🔹 Concatenamos si hay base/guisos
  let extras = [];
  if (base) extras.push(base);
  if (guisos) extras.push(guisos);

  let itemNombre = nombre;
  if (extras.length > 0) {
    itemNombre += ` (${extras.join(" | ")})`;
  }

  // Agregar al resumen
  const li = document.createElement("li");
  li.textContent = `${cantidad} x ${itemNombre} ($${precio} c/u) = $${subtotal}`;
  listaResumen.appendChild(li);

  total += subtotal;
  hayProductos = true;
}
  });

  if (hayProductos) {
    totalResumen.textContent = `Total: $${total}`;
    resumenPedido.classList.remove("d-none");
  } else {
    resumenPedido.classList.add("d-none");
  }
}

function generarPedidoWhatsApp() {
  const productos = document.querySelectorAll('.producto');
  let mensaje = "Hola, quiero hacer un pedido:%0A";
  let total = 0;
  let seleccionoAlgo = false;

  productos.forEach(card => {
    const nombre = card.dataset.nombre;
    const precio = parseInt(card.dataset.precio);
    const cantidad = parseInt(card.querySelector('.cantidad').textContent);

    if (cantidad > 0) {
  let subtotal = cantidad * precio;

  // 🔹 Base seleccionada
  const base = card.querySelector('.combo-base')?.value || "";

  // 🔹 Guisos seleccionados
  const guisos = Array.from(card.querySelectorAll('.combo-guiso:checked'))
    .map(el => el.value)
    .join(", ");

  // 🔹 Concatenamos si hay base/guisos
  let extras = [];
  if (base) extras.push(base);
  if (guisos) extras.push(guisos);

  let itemNombre = nombre;
  if (extras.length > 0) {
    itemNombre += ` (${extras.join(" | ")})`;
  }

  mensaje += `- ${cantidad} x ${itemNombre} ($${precio} c/u) = $${subtotal}%0A`;
  total += subtotal;
  seleccionoAlgo = true;
}
  });

  if (!seleccionoAlgo) {
    alert("🍜 Por favor, selecciona al menos un platillo individual o un combo, incluso algunos snacks ♥");
    return;
  }

  mensaje += `%0A🔸 Total: $${total}`;
  const confirmar = confirm("¿Quieres enviar tu pedido por WhatsApp?");
  if (confirmar) {
    const numeroWhatsApp = "5580342881";
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, "_blank");
  }
}

function limpiarPedido() {
  const productos = document.querySelectorAll('.producto');
  const listaResumen = document.getElementById('listaResumen');
  const totalResumen = document.getElementById('totalResumen');
  const resumenPedido = document.getElementById('resumenPedido');

  productos.forEach(card => {
    card.querySelector('.cantidad').textContent = "0";
  });

  listaResumen.innerHTML = "";
  totalResumen.textContent = "";
  resumenPedido.classList.add("d-none");
}
